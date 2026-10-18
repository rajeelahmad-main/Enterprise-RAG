import { NextRequest, NextResponse } from 'next/server';
import { loadKnowledgeBase } from '@/lib/rag';

export async function GET(req: NextRequest) {
  try {
    const kb = loadKnowledgeBase();

    return NextResponse.json({
      success: true,
      stats: {
        totalDocuments: kb.totalDocuments,
        totalChunks: kb.totalChunks,
        embeddingModel: kb.embeddingModel,
        embeddingDim: kb.embeddingDim,
        generatedAt: kb.generatedAt,
      },
      documents: kb.documents,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
