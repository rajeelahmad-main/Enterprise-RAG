import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFParse } from 'pdf-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATASET_DIR = path.resolve(__dirname, '../company_hr_rag_dataset');
const PDF_PATH = path.join(DATASET_DIR, 'Sukkur_IBA_University_Handbook_2018.pdf');
const OUTPUT_DIR = path.resolve(__dirname, '../src/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'embedded_knowledge_base.json');

function getApiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  const envPath = path.resolve(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const raw = fs.readFileSync(envPath, 'utf-8');
    const match = raw.match(/GEMINI_API_KEY=([^\r\n]+)/);
    if (match) return match[1].trim();
  }
  return '';
}

const API_KEY = getApiKey();
const EMBED_MODEL = process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001';

// Vector normalization for fast cosine similarity via dot product
function normalize(vec) {
  const norm = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
  if (norm === 0) return vec;
  return vec.map((val) => val / norm);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function batchEmbedTextsWithRetry(texts, retries = 5) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:batchEmbedContents?key=${API_KEY}`;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const requests = texts.map((text) => ({
        model: `models/${EMBED_MODEL}`,
        content: { parts: [{ text }] }
      }));

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requests })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      if (!data.embeddings || !Array.isArray(data.embeddings)) {
        throw new Error('Invalid batch embedding response: ' + JSON.stringify(data));
      }

      return data.embeddings.map((item) => normalize(item.values));
    } catch (err) {
      console.warn(`\n[Attempt ${attempt}/${retries}] Batch embedding failed: ${err.message.slice(0, 100)}...`);
      if (attempt === retries) throw err;
      const backoff = Math.min(30000, 5000 * Math.pow(2, attempt - 1));
      console.log(`Waiting ${backoff / 1000}s before retry...`);
      await sleep(backoff);
    }
  }
}

// Table of contents mapping for 118-page Sukkur IBA University Handbook (2018)
const sectionTOC = [
  { start: 1, end: 3, section: 'Orientation & Preface', docId: 'SIBAU-PREFACE' },
  { start: 4, end: 5, section: 'Table of Contents', docId: 'SIBAU-TOC' },
  { start: 6, end: 6, section: 'SECTION 1: Introduction and Vision of Sukkur IBA University', docId: 'SIBAU-SEC-01' },
  { start: 7, end: 10, section: 'SECTION 2.1: Code of Conduct Policy', docId: 'SIBAU-SEC-02.1' },
  { start: 11, end: 14, section: 'SECTION 2.2: Conflict of Interest Policy (COI)', docId: 'SIBAU-SEC-02.2' },
  { start: 15, end: 15, section: 'SECTION 2.3: SIBAU Smoke-Free Policy', docId: 'SIBAU-SEC-02.3' },
  { start: 16, end: 16, section: 'SECTION 2.4: Sexual Harassment Policy (HEC Guidelines)', docId: 'SIBAU-SEC-02.4' },
  { start: 17, end: 22, section: 'SECTION 3.1: Recruitment and Selection Policy', docId: 'SIBAU-SEC-03.1' },
  { start: 23, end: 25, section: 'SECTION 3.2: Placement Procedure & Working Hours', docId: 'SIBAU-SEC-03.2' },
  { start: 26, end: 27, section: 'SECTION 3.3: Attendance Policy & Good Attendance Reward', docId: 'SIBAU-SEC-03.3' },
  { start: 28, end: 28, section: 'SECTION 3.4: Separation & Resignation Procedure', docId: 'SIBAU-SEC-03.4' },
  { start: 29, end: 32, section: 'SECTION 3.5: Lien Policy', docId: 'SIBAU-SEC-03.5' },
  { start: 33, end: 40, section: 'SECTION 3.6: Comprehensive Leave Policy (Earned, Casual, Sabbatical, LPR, Maternity)', docId: 'SIBAU-SEC-03.6' },
  { start: 41, end: 41, section: 'SECTION 3.7: House Allotment Policy', docId: 'SIBAU-SEC-03.7' },
  { start: 42, end: 42, section: 'SECTION 3.8: Hostels Allotment Policy', docId: 'SIBAU-SEC-03.8' },
  { start: 43, end: 45, section: 'SECTION 3.9: Vehicle Loan Policy', docId: 'SIBAU-SEC-03.9' },
  { start: 46, end: 46, section: 'SECTION 3.10: Laptop Loan Policy', docId: 'SIBAU-SEC-03.10' },
  { start: 46, end: 48, section: 'SECTION 3.11: Provident Fund Policy and Procedure', docId: 'SIBAU-SEC-03.11' },
  { start: 49, end: 53, section: 'SECTION 3.12: Travelling and Accommodation Policy (TA/DA)', docId: 'SIBAU-SEC-03.12' },
  { start: 54, end: 56, section: 'SECTION 3.13: Salary, Benefits, & Pay Protection Policy', docId: 'SIBAU-SEC-03.13' },
  { start: 57, end: 58, section: 'SECTION 3.15: Training and Development', docId: 'SIBAU-SEC-03.15' },
  { start: 59, end: 59, section: 'SECTION 3.16: House Acquisition Policy', docId: 'SIBAU-SEC-03.16' },
  { start: 59, end: 61, section: 'SECTION 3.17: Grievance Handling Procedure', docId: 'SIBAU-SEC-03.17' },
  { start: 62, end: 62, section: 'SECTION 3.18: Earned Leave Encashment Policy', docId: 'SIBAU-SEC-03.18' },
  { start: 63, end: 66, section: 'SECTION 3.19: Employees Gratuity Policy', docId: 'SIBAU-SEC-03.19' },
  { start: 67, end: 67, section: 'SECTION 3.20: Health Insurance Policy', docId: 'SIBAU-SEC-03.20' },
  { start: 68, end: 88, section: 'SECTION 3.21: Promotion Policy for Non-Teaching Staff', docId: 'SIBAU-SEC-03.21' },
  { start: 89, end: 92, section: 'SECTION 3.22: Study Leave Policy', docId: 'SIBAU-SEC-03.22' },
  { start: 93, end: 93, section: 'SECTION 3.23: Teaching Allowance Policy', docId: 'SIBAU-SEC-03.23' },
  { start: 93, end: 94, section: 'SECTION 3.24: Qualification Allowances (PhD & MS/MPhil)', docId: 'SIBAU-SEC-03.24' },
  { start: 94, end: 95, section: 'SECTION 3.25: Employee Loan Policy', docId: 'SIBAU-SEC-03.25' },
  { start: 95, end: 96, section: 'SECTION 3.26: Tuition Fees Policy', docId: 'SIBAU-SEC-03.26' },
  { start: 97, end: 97, section: 'SECTION 4.1: Advances Acquisition & Reimbursement', docId: 'SIBAU-SEC-04.1' },
  { start: 98, end: 100, section: 'SECTION 4.3: Procurement and Payments of Purchases', docId: 'SIBAU-SEC-04.3' },
  { start: 101, end: 101, section: 'SECTION 4.4: Petty Cash Payments', docId: 'SIBAU-SEC-04.4' },
  { start: 102, end: 102, section: 'SECTION 4.5: Security Service & Advance Payments', docId: 'SIBAU-SEC-04.5' },
  { start: 102, end: 103, section: 'SECTION 4.7: SOPs for Transport & Night Emergency Bolan', docId: 'SIBAU-SEC-04.7' },
  { start: 104, end: 113, section: 'SECTION 4.8: Research Policy & ORIC', docId: 'SIBAU-SEC-04.8' },
  { start: 114, end: 118, section: 'SECTION 4.9: Case Study Development & Research Grants', docId: 'SIBAU-SEC-04.9' }
];

function getSectionForPage(pageNum) {
  const match = sectionTOC.find(s => pageNum >= s.start && pageNum <= s.end);
  if (match) return match;
  return {
    start: pageNum,
    end: pageNum,
    section: `Section Policy pp. ${pageNum}`,
    docId: `SIBAU-SEC-P${pageNum}`
  };
}

const cleanPageText = (text) => {
  return text
    .replace(/SIBAU Employee Handbook\s+Sukkur IBA University \d+/gi, '')
    .replace(/-- \d+ of 118 --/gi, '')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

async function parseAndChunkPDF(pdfPath) {
  console.log(`📄 Loading PDF directly: ${pdfPath}`);
  const buffer = fs.readFileSync(pdfPath);
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  
  console.log(`✅ Extracted ${result.pages.length} pages from PDF (${result.text.length} characters)`);

  const pages = result.pages.map(p => ({
    num: p.num,
    text: cleanPageText(p.text)
  }));

  const chunks = [];
  const MAX_CHUNK_CHARS = 2400;

  let currentChunkPages = [];
  let currentChunkText = '';
  let startPage = 1;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    if (currentChunkPages.length === 0) {
      startPage = page.num;
    }

    const pageContent = `\n\n[Handbook Page ${page.num}]\n${page.text}`;
    
    if (currentChunkText.length + pageContent.length > MAX_CHUNK_CHARS && currentChunkText.length > 800) {
      const endPage = pages[i - 1].num;
      const tocInfo = getSectionForPage(startPage);
      
      const formattedChunk = `Document: Sukkur IBA University Employees Handbook - 2018 (Official PDF)
Section: ${tocInfo.section}
Handbook Pages: ${startPage} to ${endPage}
Source: Sukkur_IBA_University_Handbook_2018.pdf
---
${currentChunkText.trim()}`;

      chunks.push({
        id: `SIBAU-PDF-P${startPage}-P${endPage}`,
        docId: `[${tocInfo.docId}: ${tocInfo.section} (pp. ${startPage}-${endPage})]`,
        title: `Sukkur IBA University Handbook 2018 - ${tocInfo.section} (pp. ${startPage}-${endPage})`,
        section: tocInfo.section,
        source: 'Sukkur_IBA_University_Handbook_2018.pdf',
        pageStart: startPage,
        pageEnd: endPage,
        content: formattedChunk
      });

      currentChunkPages = [page.num];
      currentChunkText = pageContent;
      startPage = page.num;
    } else {
      currentChunkPages.push(page.num);
      currentChunkText += pageContent;
    }
  }

  // Flush final chunk
  if (currentChunkText.trim().length > 0) {
    const endPage = pages[pages.length - 1].num;
    const tocInfo = getSectionForPage(startPage);
    
    const formattedChunk = `Document: Sukkur IBA University Employees Handbook - 2018 (Official PDF)
Section: ${tocInfo.section}
Handbook Pages: ${startPage} to ${endPage}
Source: Sukkur_IBA_University_Handbook_2018.pdf
---
${currentChunkText.trim()}`;

    chunks.push({
      id: `SIBAU-PDF-P${startPage}-P${endPage}`,
      docId: `[${tocInfo.docId}: ${tocInfo.section} (pp. ${startPage}-${endPage})]`,
      title: `Sukkur IBA University Handbook 2018 - ${tocInfo.section} (pp. ${startPage}-${endPage})`,
      section: tocInfo.section,
      source: 'Sukkur_IBA_University_Handbook_2018.pdf',
      pageStart: startPage,
      pageEnd: endPage,
      content: formattedChunk
    });
  }

  await parser.destroy();
  return chunks;
}

async function main() {
  console.log('🏛️ Sukkur IBA University (SIBAU) PDF Vector Knowledge Base Embedder');
  console.log(`📌 Target PDF: ${PDF_PATH}`);
  console.log(`🤖 Embedding Model: ${EMBED_MODEL}`);

  if (!API_KEY) {
    console.error('❌ Error: GEMINI_API_KEY is not configured in .env.local or environment');
    process.exit(1);
  }

  if (!fs.existsSync(PDF_PATH)) {
    console.error(`❌ Error: PDF file not found at ${PDF_PATH}`);
    process.exit(1);
  }

  const chunks = await parseAndChunkPDF(PDF_PATH);
  console.log(`\n📚 Generated ${chunks.length} semantic chunks from the 118-page PDF.`);

  console.log('\n🚀 Starting Batch Vector Embeddings via Google Gemini API...');
  const embeddedChunks = [];
  const BATCH_SIZE = 25;

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const batchIndex = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(chunks.length / BATCH_SIZE);

    console.log(`📦 Processing Batch ${batchIndex}/${totalBatches} (${batch.length} chunks: items ${i + 1} to ${i + batch.length})...`);

    const textsToEmbed = batch.map(c => `${c.title}\n${c.section}\n${c.content}`);
    const embeddings = await batchEmbedTextsWithRetry(textsToEmbed);

    for (let j = 0; j < batch.length; j++) {
      const chunk = batch[j];
      embeddedChunks.push({
        id: chunk.id,
        docId: chunk.docId,
        title: chunk.title,
        section: chunk.section,
        source: chunk.source,
        pageStart: chunk.pageStart,
        pageEnd: chunk.pageEnd,
        content: chunk.content,
        embedding: embeddings[j]
      });
    }

    console.log(`✓ Batch ${batchIndex}/${totalBatches} completed successfully.`);
    if (i + BATCH_SIZE < chunks.length) {
      await sleep(2000); // 2s pacing between batches
    }
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const formattedChunks = embeddedChunks.map((c) => ({
    id: c.id,
    docId: c.docId,
    docTitle: c.title,
    filename: 'Sukkur_IBA_University_Handbook_2018.pdf',
    owner: 'Registrar Office & HR',
    version: '2018.1',
    section: c.section,
    pageStart: c.pageStart,
    pageEnd: c.pageEnd,
    content: c.content,
    fullContext: `${c.title}\n${c.content}`,
    embedding: c.embedding
  }));

  const sectionMap = new Map();
  for (const c of formattedChunks) {
    if (!sectionMap.has(c.section)) {
      sectionMap.set(c.section, {
        docId: c.docId,
        title: c.section,
        filename: 'Sukkur_IBA_University_Handbook_2018.pdf',
        owner: 'Registrar Office & HR',
        version: '2018.1',
        chunkCount: 0,
        samplePreview: c.content.slice(0, 160) + '...'
      });
    }
    sectionMap.get(c.section).chunkCount++;
  }

  const documents = Array.from(sectionMap.values());

  const payload = {
    version: '2018.1',
    generatedAt: new Date().toISOString(),
    datasetSource: 'Sukkur_IBA_University_Handbook_2018.pdf',
    documentTitle: 'Sukkur IBA University Employees Handbook - 2018',
    totalPages: 118,
    embeddingModel: EMBED_MODEL,
    embeddingDim: formattedChunks[0]?.embedding?.length || 3072,
    totalDocuments: documents.length,
    totalChunks: formattedChunks.length,
    documents,
    chunks: formattedChunks
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(payload, null, 2), 'utf-8');
  console.log(`\n🎉 SUCCESS! Generated ${formattedChunks.length} embedded chunks directly from PDF.`);
  console.log(`💾 Saved to ${OUTPUT_FILE} (${(fs.statSync(OUTPUT_FILE).size / (1024 * 1024)).toFixed(2)} MB)`);
}

main().catch((err) => {
  console.error('\n❌ Fatal error embedding PDF:', err);
  process.exit(1);
});
