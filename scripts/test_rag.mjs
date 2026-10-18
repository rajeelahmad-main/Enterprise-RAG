import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KB_FILE = path.resolve(__dirname, '../src/data/embedded_knowledge_base.json');
const API_KEY = process.env.GEMINI_API_KEY || '';
const EMBED_MODEL = process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001';
const CHAT_MODEL = process.env.GEMINI_CHAT_MODEL || 'gemini-3.8-flash';

if (!fs.existsSync(KB_FILE)) {
  console.error('Knowledge base not found at:', KB_FILE);
  process.exit(1);
}

const kb = JSON.parse(fs.readFileSync(KB_FILE, 'utf-8'));
console.log(`Loaded ${kb.chunks.length} embedded chunks from knowledge base.`);

// Cosine similarity for normalized vectors is simply the dot product
function cosineSimilarity(vecA, vecB) {
  let dot = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
  }
  return dot;
}

function normalize(vec) {
  const norm = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
  if (norm === 0) return vec;
  return vec.map((v) => v / norm);
}

async function embedQuery(query) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:embedContent?key=${API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: { parts: [{ text: query }] }
    })
  });
  if (!res.ok) {
    throw new Error(`Embedding query failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return normalize(data.embedding.values);
}

// Hybrid search: Vector similarity + keyword overlap boost
function searchChunks(query, queryVec, topK = 3) {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\W+/).filter((w) => w.length > 3);

  const scored = kb.chunks.map((chunk) => {
    const vectorScore = cosineSimilarity(queryVec, chunk.embedding);
    
    // Keyword match boost
    let keywordBoost = 0;
    const contentLower = (chunk.docTitle + ' ' + chunk.section + ' ' + chunk.content).toLowerCase();
    for (const w of queryWords) {
      if (contentLower.includes(w)) {
        keywordBoost += 0.03;
      }
    }
    
    // ID exact match boost
    if (chunk.docId && queryLower.includes(chunk.docId.toLowerCase())) {
      keywordBoost += 0.15;
    }

    const finalScore = vectorScore * 0.85 + Math.min(keywordBoost, 0.15);

    return {
      chunk,
      score: finalScore,
      vectorScore
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

async function askRAG(question) {
  console.log(`\n======================================================`);
  console.log(`❓ Question: "${question}"`);

  // 1. Embed query
  const queryVec = await embedQuery(question);

  // 2. Retrieve top chunks
  const retrieved = searchChunks(question, queryVec, 3);
  console.log(`🔍 Retrieved top ${retrieved.length} relevant policy excerpts:`);
  retrieved.forEach((r, idx) => {
    console.log(
      `   [${idx + 1}] (${(r.score * 100).toFixed(1)}% match) ${r.chunk.docTitle} [${r.chunk.docId}] - ${r.chunk.section}`
    );
  });

  // 3. Assemble prompt context
  const contextText = retrieved
    .map(
      (r, i) =>
        `[Source ${i + 1} | Document ID: ${r.chunk.docId} | Title: ${r.chunk.docTitle} | Section: ${r.chunk.section}]\n${r.chunk.content}`
    )
    .join('\n\n');

  const systemInstruction = `You are Northstar Digital Services' Enterprise HR AI Assistant.
Answer the user's inquiry based strictly on the provided company policy excerpts.
Always cite the specific document title and Document ID (e.g. "[HR-002: Annual Leave Policy]").
If the provided excerpts do not contain enough information to answer definitively, state what you know and direct the employee to People Operations (peopleops@northstar.example) or IT Security (security@northstar.example).
Keep answers professional, empathetic, and direct.`;

  const prompt = `${systemInstruction}\n\n=== OFFICIAL COMPANY HR POLICY CONTEXT ===\n${contextText}\n\n=== EMPLOYEE QUESTION ===\n${question}\n\n=== RESPONSE ===`;

  // 4. Generate answer with Gemini
  const genUrl = `https://generativelanguage.googleapis.com/v1beta/models/${CHAT_MODEL}:generateContent?key=${API_KEY}`;
  const genRes = await fetch(genUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 600
      }
    })
  });

  if (!genRes.ok) {
    throw new Error(`Generation failed: ${genRes.status} ${await genRes.text()}`);
  }

  const genData = await genRes.json();
  const answer = genData.candidates[0].content.parts[0].text;
  console.log(`💬 Answer:\n${answer}\n`);

  return {
    question,
    retrieved: retrieved.map((r) => ({
      docId: r.chunk.docId,
      docTitle: r.chunk.docTitle,
      section: r.chunk.section,
      score: r.score
    })),
    answer
  };
}

async function runBenchmark() {
  const testQuestions = [
    'How many annual leave days are provided each year?',
    'How far in advance should I request four consecutive days off?',
    'Who should I notify about a suspected phishing email?',
    'Can I upload company files to an unapproved AI tool?',
    'What is the expected payroll date?',
    'How many remote days may an eligible employee request?'
  ];

  console.log(`🧪 Running RAG benchmark on ${testQuestions.length} enterprise test cases...`);
  
  for (const q of testQuestions) {
    await askRAG(q);
    // brief delay between calls
    await new Promise((r) => setTimeout(r, 600));
  }

  console.log('🎉 All RAG benchmark queries completed successfully!');
}

runBenchmark().catch((err) => {
  console.error('❌ RAG Benchmark failed:', err);
  process.exit(1);
});
