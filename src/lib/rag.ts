import fs from 'fs';
import path from 'path';

export interface PolicyChunk {
  id: string;
  docId: string;
  docTitle: string;
  filename: string;
  owner: string;
  version: string;
  section: string;
  content: string;
  fullContext: string;
  embedding: number[];
}

export interface PolicyDocument {
  docId: string;
  title: string;
  filename: string;
  owner: string;
  version: string;
  chunkCount: number;
  samplePreview: string;
}

export interface KnowledgeBase {
  version: string;
  generatedAt: string;
  embeddingModel: string;
  embeddingDim: number;
  totalDocuments: number;
  totalChunks: number;
  documents: PolicyDocument[];
  chunks: PolicyChunk[];
}

export interface RetrievalResult {
  chunk: PolicyChunk;
  score: number;
  vectorScore: number;
}

export interface ChatCitation {
  id: string;
  docId: string;
  docTitle: string;
  section: string;
  owner: string;
  score: number;
  snippet: string;
}

export interface ChatResponse {
  answer: string;
  citations: ChatCitation[];
  metrics: {
    retrievalLatencyMs: number;
    generationLatencyMs: number;
    totalLatencyMs: number;
    chunksSearched: number;
    modelUsed: string;
  };
}

const API_KEY = process.env.GEMINI_API_KEY || '';
const EMBED_MODEL = process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001';

// Primary Model: Gemini 3.1 Flash Lite | Backup Model: Gemini 3.5 Flash Lite
const PRIMARY_CHAT_MODEL = process.env.GEMINI_CHAT_MODEL || 'gemini-3.1-flash-lite';
const BACKUP_CHAT_MODEL = process.env.GEMINI_FALLBACK_CHAT_MODEL || 'gemini-3.5-flash-lite';

// Cached in-memory knowledge base
let cachedKB: KnowledgeBase | null = null;

export function loadKnowledgeBase(): KnowledgeBase {
  if (cachedKB) return cachedKB;

  const kbPath = path.join(process.cwd(), 'src', 'data', 'embedded_knowledge_base.json');
  if (!fs.existsSync(kbPath)) {
    throw new Error(`Knowledge base not found at: ${kbPath}. Run npm run embed first.`);
  }

  const raw = fs.readFileSync(kbPath, 'utf-8');
  cachedKB = JSON.parse(raw) as KnowledgeBase;
  return cachedKB;
}

function normalize(vec: number[]): number[] {
  const norm = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
  if (norm === 0) return vec;
  return vec.map((v) => v / norm);
}

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dot = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
  }
  return dot;
}

export async function embedText(text: string): Promise<number[]> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:embedContent?key=${API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: { parts: [{ text }] }
    })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Embedding request failed (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  if (!data.embedding || !data.embedding.values) {
    throw new Error('Invalid embedding response: ' + JSON.stringify(data));
  }

  return normalize(data.embedding.values);
}

export function searchKnowledgeBase(query: string, queryVec: number[], topK = 6): RetrievalResult[] {
  const kb = loadKnowledgeBase();
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\W+/).filter((w) => w.length > 3);

  const scored: RetrievalResult[] = kb.chunks.map((chunk) => {
    const vectorScore = cosineSimilarity(queryVec, chunk.embedding);

    let keywordBoost = 0;
    const contentLower = `${chunk.docTitle} ${chunk.section} ${chunk.content}`.toLowerCase();
    for (const w of queryWords) {
      if (contentLower.includes(w)) {
        keywordBoost += 0.04;
      }
    }

    if (chunk.docId && queryLower.includes(chunk.docId.toLowerCase())) {
      keywordBoost += 0.2;
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

export async function askEnterpriseHR(
  userQuery: string,
  chatHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<ChatResponse> {
  const startTime = Date.now();

  // 1. Embed query
  const embedStart = Date.now();
  const queryVec = await embedText(userQuery);

  // 2. Retrieve top matching chunks (expanded to top 6 chunks for richer, comprehensive context)
  const retrieved = searchKnowledgeBase(userQuery, queryVec, 6);
  const retrievalLatencyMs = Date.now() - embedStart;

  // 3. Assemble Grounded Enterprise Prompt
  const contextBlock = retrieved
    .map(
      (r, idx) =>
        `### Document [${r.chunk.docId}]: ${r.chunk.docTitle}\n` +
        `**Section**: ${r.chunk.section}\n` +
        `**Owner**: ${r.chunk.owner}\n` +
        `**Text**: ${r.chunk.content}`
    )
    .join('\n\n---\n\n');

  const systemInstruction = `You are "Sukkur IBA University (SIBAU) HR Advisor", an empathetic, highly knowledgeable, and friendly Senior HR Officer at Sukkur IBA University.

YOUR GOAL:
Provide warm, completely natural, and comprehensive answers to employees' and faculty members' workplace questions, giving rich, detailed guidance drawn directly from our official Sukkur IBA University Employee Handbook (2018).

CRITICAL INSTRUCTIONS FOR NATURAL, HIGH-QUALITY RESPONSES:
1. Conversational & Warm Human Persona:
   - Talk directly to the employee in an authentic, supportive, and natural conversational style (e.g. "Hi there! I'd be happy to explain our leave policy.", "Hello! Great question about our loan schemes.").
   - DO NOT sound like a rigid machine. Avoid mechanical boilerplate labels like "### Executive Summary", "### Key Policy Points", or "### Actionable Steps" unless the employee specifically asks for a formal report.
   - Use clean, well-spaced natural paragraphs and intuitive bullet points to make complex rules easy and pleasant to digest.

2. Rich, Detailed Guidance from the SIBAU Employee Handbook:
   - Provide comprehensive, thorough answers covering all relevant aspects found in the documents. Don't stop at just a brief 1-line answer.
   - Include specific numbers, rules, timelines, and amounts:
     * Earned Leave: 30 days/year (accrues 2.5 days/month), available after 1 year, accumulates without limit, non-teaching can encash up to 345 days; faculty can only take leave during semester breaks.
     * Sick Leave: 10 working days/year (medical certificate required from PMDC doctor if > 2 days).
     * Casual Leave: 10 working days/year (0.8 days/month), max 3 consecutive days.
     * Maternity Leave: 90 days with full pay (45 prenatal, 45 postnatal), max 3 times in service.
     * Attendance & Late Comings: 15-min grace; 15min-2hr deducts 1/4 casual leave; 2-4hr deducts 1/2 day; >4hr marked absent; max 7 late arrivals per month before Explanation Call. Good Attendance Reward of Rs. 150-300/month plus quarterly bonuses.
     * Work Hours: 48 hours/week (Mon-Sat 9:00 AM - 5:00 PM), with Friday break from 12:30 to 2:30 PM for Juma prayer and lunch.
     * Vehicle Loan (Grade 17+): 3 years service, gross salary >= Rs. 30,000, 48 equal installments with 5% service charge, max 25% take-home pay.
     * Laptop Loan (Faculty): Rs. 60,000 in 12 equal monthly installments (one-time).
     * Employee Loan: Up to 3 Gross Salaries in 24 equal installments.
     * Qualification Allowances: PhD Allowance: Rs. 10,000/month; MS/MPhil Allowance: Rs. 2,500/month.
     * Tuition Fee Waiver: 50% waiver after probation, 100% waiver after 3 years; 50% waiver for siblings.
     * Study Leave & Surety Bond: Up to 4 years (1yr leave = 1.5yr bond; 2yr = 2.5yr; 3yr = 4yr; 4yr = 5yr).
     * Night Emergency Transport: Carry Bolan vehicle available 7:00 PM to 7:00 AM with 2 night drivers. Point buses to city on Wednesday/Sunday for staff and Thursday for female students.
     * Research Publication Rewards: Category A (Rs. 150,000), Category B (Rs. 100,000), Category C (Rs. 30,000), Best Researcher Award (Rs. 200,000).
   - Cite the relevant official policy naturally (e.g., "**[SIBAU-HR-03.6: Comprehensive Leave Policy]**" or "**[SIBAU-HR-03.9-10-25: Vehicle & Laptop Loan Policies]**").

3. Multilingual Empathy:
   - Fluently match the language of the employee's inquiry (e.g., English, Urdu / اردو, Roman Urdu, Sindhi / سنڌي, etc.).
   - In Urdu: speak with authentic, polite, and natural Urdu (e.g. "السلام علیکم! سکھر آئی بی اے یونیورسٹی کی سالانہ چھٹیوں کی پالیسی کے مطابق...").
   - In Roman Urdu: speak in natural, friendly Roman Urdu (e.g. "Assalam o Alaikum! Sukkur IBA University ki leave policy ke mutabiq...").

4. Helpful Support:
   - Close warmly, offering further help and providing the appropriate department email (e.g. \`hr@iba-suk.edu.pk\` or \`registrar@iba-suk.edu.pk\`).
   - If a question is not covered in the handbook, honestly let the employee know and guide them to the HR Department or Registrar Office.`;

  // Format conversation history for Gemini
  const formattedHistory = chatHistory.slice(-4).map((h) => ({
    role: h.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: h.content }]
  }));

  const userPromptWithContext =
    `=== OFFICIAL COMPANY POLICY CONTEXT ===\n${contextBlock}\n\n` +
    `=== EMPLOYEE QUESTION ===\n${userQuery}\n\n` +
    `Please provide a warm, thorough, and natural HR response based on the policy context above.`;

  const contents = [
    ...formattedHistory,
    {
      role: 'user',
      parts: [{ text: userPromptWithContext }]
    }
  ];

  // 4. Primary: gemini-3.1-flash-lite | Backup: gemini-3.5-flash-lite
  const candidateModels = Array.from(
    new Set([PRIMARY_CHAT_MODEL, BACKUP_CHAT_MODEL, 'gemini-3.8-flash-lite'])
  );

  let answer = '';
  let lastError = '';
  let modelUsed = PRIMARY_CHAT_MODEL;
  const genStart = Date.now();

  for (const model of candidateModels) {
    let succeeded = false;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const genUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
        const genRes = await fetch(genUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [{ text: systemInstruction }]
            },
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 1200
            }
          })
        });

        if (genRes.ok) {
          const genData = await genRes.json();
          answer = genData.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (answer) {
            succeeded = true;
            modelUsed = model;
            break;
          }
        } else {
          const errorText = await genRes.text();
          lastError = `[${model} attempt ${attempt}] HTTP ${genRes.status}: ${errorText}`;
          if (genRes.status === 503 || genRes.status === 429) {
            await new Promise((r) => setTimeout(r, 800 * attempt));
          }
        }
      } catch (err: any) {
        lastError = err.message;
        await new Promise((r) => setTimeout(r, 800 * attempt));
      }
    }
    if (succeeded && answer) break;
  }

  if (!answer) {
    throw new Error(`Generation failed across models: ${lastError}`);
  }

  const generationLatencyMs = Date.now() - genStart;
  const totalLatencyMs = Date.now() - startTime;

  const citations: ChatCitation[] = retrieved.slice(0, 4).map((r) => ({
    id: r.chunk.id,
    docId: r.chunk.docId,
    docTitle: r.chunk.docTitle,
    section: r.chunk.section,
    owner: r.chunk.owner,
    score: Math.round(r.score * 100) / 100,
    snippet: r.chunk.content.slice(0, 180) + '...'
  }));

  return {
    answer,
    citations,
    metrics: {
      retrievalLatencyMs,
      generationLatencyMs,
      totalLatencyMs,
      chunksSearched: cachedKB?.chunks.length || 0,
      modelUsed
    }
  };
}

// Ingestion helper for HR Admins to add/re-embed policies dynamically
export async function addDynamicPolicy(params: {
  title: string;
  docId: string;
  owner: string;
  section: string;
  content: string;
}): Promise<PolicyChunk> {
  const kb = loadKnowledgeBase();
  const fullContext = `Document: ${params.title} (${params.docId})\nSection: ${params.section}\nOwner: ${params.owner}\nContent: ${params.content}`;
  const embedding = await embedText(fullContext);

  const newChunk: PolicyChunk = {
    id: `${params.docId}_dyn_${Date.now()}`,
    docId: params.docId,
    docTitle: params.title,
    filename: `custom_${params.docId.toLowerCase()}.md`,
    owner: params.owner,
    version: '1.0',
    section: params.section,
    content: params.content,
    fullContext,
    embedding
  };

  kb.chunks.push(newChunk);
  kb.totalChunks = kb.chunks.length;

  const kbPath = path.join(process.cwd(), 'src', 'data', 'embedded_knowledge_base.json');
  fs.writeFileSync(kbPath, JSON.stringify(kb, null, 2), 'utf-8');

  return newChunk;
}
