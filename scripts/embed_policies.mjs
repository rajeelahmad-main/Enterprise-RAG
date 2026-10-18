import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATASET_DIR = path.resolve(__dirname, '../company_hr_rag_dataset');
const OUTPUT_DIR = path.resolve(__dirname, '../src/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'embedded_knowledge_base.json');

// Get API Key from environment or fallback to user provided key
const API_KEY = process.env.GEMINI_API_KEY || '';
const EMBED_MODEL = process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001';

// Vector normalization for fast cosine similarity via dot product
function normalize(vec) {
  const norm = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
  if (norm === 0) return vec;
  return vec.map((val) => val / norm);
}

// Rate limiting sleep helper
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function embedTextWithRetry(text, retries = 3) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:embedContent?key=${API_KEY}`;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: { parts: [{ text }] }
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      if (!data.embedding || !data.embedding.values) {
        throw new Error('Invalid embedding response: ' + JSON.stringify(data));
      }

      return normalize(data.embedding.values);
    } catch (err) {
      console.warn(`[Attempt ${attempt}/${retries}] Embedding failed for "${text.slice(0, 40)}...":`, err.message);
      if (attempt === retries) throw err;
      await sleep(1500 * attempt);
    }
  }
}

function parseMarkdownDocument(filePath, filename) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const lines = raw.split(/\r?\n/);
  
  let title = filename.replace(/^\d+_/, '').replace('.md', '').replace(/_/g, ' ');
  let docId = 'HR-UNKNOWN';
  let owner = 'People Operations';
  let version = '1.0';

  // Extract title from first line if # Header
  const titleLine = lines.find((l) => l.startsWith('# '));
  if (titleLine) {
    title = titleLine.replace('# ', '').trim();
  }

  // Extract Document ID, Owner, Version
  for (const line of lines) {
    const docIdMatch = line.match(/Document ID:\s*([A-Z0-9-]+)/i);
    if (docIdMatch) docId = docIdMatch[1].trim();

    const ownerMatch = line.match(/Owner:\s*([^|]+)/i);
    if (ownerMatch) owner = ownerMatch[1].trim();

    const versionMatch = line.match(/Version:\s*([0-9.]+)/i);
    if (versionMatch) version = versionMatch[1].trim();
  }

  // Split into sections by ## headers
  const chunks = [];
  let currentSection = 'Overview';
  let currentContentLines = [];

  const flushChunk = () => {
    const text = currentContentLines.join('\n').trim();
    if (text.length > 20) {
      // Create clean semantic chunk text with context header
      const semanticContext = `Document: ${title} (${docId})\nSection: ${currentSection}\nOwner: ${owner}\nContent: ${text}`;
      chunks.push({
        id: `${docId}_${chunks.length + 1}`,
        docId,
        docTitle: title,
        filename,
        owner,
        version,
        section: currentSection,
        content: text,
        fullContext: semanticContext
      });
    }
    currentContentLines = [];
  };

  for (const line of lines) {
    if (line.startsWith('# ')) {
      // main title, skip
      continue;
    } else if (line.startsWith('## ')) {
      flushChunk();
      currentSection = line.replace('## ', '').trim();
    } else if (line.startsWith('Document ID:') || line.startsWith('Company:')) {
      // metadata line, include in context
      continue;
    } else {
      currentContentLines.push(line);
    }
  }
  flushChunk();

  // If no sections were split (e.g. document without ## headers), chunk by paragraphs
  if (chunks.length === 0) {
    const paragraphs = raw.split(/\r?\n\r?\n/).filter((p) => p.trim().length > 30);
    paragraphs.forEach((p, idx) => {
      chunks.push({
        id: `${docId}_${idx + 1}`,
        docId,
        docTitle: title,
        filename,
        owner,
        version,
        section: `Section ${idx + 1}`,
        content: p.trim(),
        fullContext: `Document: ${title} (${docId})\nSection: Section ${idx + 1}\nContent: ${p.trim()}`
      });
    });
  }

  return {
    docId,
    title,
    filename,
    owner,
    version,
    rawText: raw,
    chunks
  };
}

async function run() {
  console.log('🚀 Starting Enterprise HR Document Ingestion & Embedding Pipeline');
  console.log(`📁 Source directory: ${DATASET_DIR}`);
  console.log(`🔑 Using Model: ${EMBED_MODEL}`);

  if (!fs.existsSync(DATASET_DIR)) {
    console.error(`Dataset directory not found at: ${DATASET_DIR}`);
    process.exit(1);
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const files = fs
    .readdirSync(DATASET_DIR)
    .filter((f) => f.endsWith('.md') && f !== 'README.md' && /^\d+_/.test(f))
    .sort();

  console.log(`📄 Found ${files.length} policy documents to parse.`);

  const allDocuments = [];
  const allChunks = [];

  for (const file of files) {
    const docPath = path.join(DATASET_DIR, file);
    const parsed = parseMarkdownDocument(docPath, file);
    allDocuments.push({
      docId: parsed.docId,
      title: parsed.title,
      filename: parsed.filename,
      owner: parsed.owner,
      version: parsed.version,
      chunkCount: parsed.chunks.length,
      samplePreview: parsed.chunks[0]?.content.slice(0, 150) + '...'
    });
    allChunks.push(...parsed.chunks);
  }

  console.log(`🧩 Total semantic chunks generated: ${allChunks.length}`);
  console.log('⚡ Generating vector embeddings via Gemini API...');

  const embeddedChunks = [];
  let completed = 0;

  for (const chunk of allChunks) {
    // Embed the full semantic context for high retrieval accuracy
    const vector = await embedTextWithRetry(chunk.fullContext);
    embeddedChunks.push({
      ...chunk,
      embedding: vector
    });
    completed++;
    if (completed % 5 === 0 || completed === allChunks.length) {
      console.log(`   [${completed}/${allChunks.length}] Chunks embedded (${Math.round((completed / allChunks.length) * 100)}%)`);
    }
    // Small delay between calls to stay well within API rate limits
    await sleep(150);
  }

  const knowledgeBase = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    embeddingModel: EMBED_MODEL,
    embeddingDim: embeddedChunks[0]?.embedding?.length || 3072,
    totalDocuments: allDocuments.length,
    totalChunks: embeddedChunks.length,
    documents: allDocuments,
    chunks: embeddedChunks
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(knowledgeBase, null, 2), 'utf-8');
  console.log(`✅ Successfully saved knowledge base to: ${OUTPUT_FILE}`);
  console.log(`📊 Total Documents: ${knowledgeBase.totalDocuments}`);
  console.log(`📊 Total Chunks: ${knowledgeBase.totalChunks}`);
  console.log(`📊 Embedding Dimension: ${knowledgeBase.embeddingDim}`);
}

run().catch((err) => {
  console.error('❌ Embedding pipeline failed:', err);
  process.exit(1);
});
