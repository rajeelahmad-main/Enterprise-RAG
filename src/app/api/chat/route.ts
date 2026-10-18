import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { askEnterpriseHR } from '@/lib/rag';

export async function POST(req: NextRequest) {
  try {
    // 1. Check for authentication (Optional - Public Access Allowed)
    const tokenCookie = req.cookies.get('auth_token')?.value;
    const authHeader = req.headers.get('authorization')?.replace('Bearer ', '');
    const token = tokenCookie || authHeader;

    let userPayload = token ? verifyToken(token) : null;
    const isGuest = !userPayload;

    // 2. Validate request payload
    const body = await req.json();
    const { message, history } = body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { error: 'Message cannot be empty.' },
        { status: 400 }
      );
    }

    // 3. Process with RAG pipeline
    const ragResponse = await askEnterpriseHR(message.trim(), history || []);

    return NextResponse.json({
      success: true,
      answer: ragResponse.answer,
      citations: ragResponse.citations,
      metrics: ragResponse.metrics,
      user: {
        name: userPayload ? userPayload.name : 'Workplace Visitor',
        role: userPayload ? userPayload.role : 'guest',
        isGuest,
      },
    });
  } catch (err: any) {
    console.error('Chat API Error:', err);
    return NextResponse.json(
      { error: err.message || 'An error occurred while answering your inquiry.' },
      { status: 500 }
    );
  }
}
