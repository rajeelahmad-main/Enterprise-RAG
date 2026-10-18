import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { addDynamicPolicy } from '@/lib/rag';

export async function POST(req: NextRequest) {
  try {
    const tokenCookie = req.cookies.get('auth_token')?.value;
    const authHeader = req.headers.get('authorization')?.replace('Bearer ', '');
    const token = tokenCookie || authHeader;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'hr_admin') {
      return NextResponse.json(
        { error: 'Forbidden: Only HR Administrators can ingest or modify policy documents.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, docId, owner, section, content } = body;

    if (!title || !docId || !content) {
      return NextResponse.json(
        { error: 'title, docId, and content are required fields.' },
        { status: 400 }
      );
    }

    const newChunk = await addDynamicPolicy({
      title: title.trim(),
      docId: docId.trim().toUpperCase(),
      owner: (owner || 'People Operations').trim(),
      section: (section || 'Policy Update').trim(),
      content: content.trim(),
    });

    return NextResponse.json({
      success: true,
      message: `Policy "${title}" successfully embedded and added to active RAG index!`,
      chunk: {
        id: newChunk.id,
        docId: newChunk.docId,
        docTitle: newChunk.docTitle,
        section: newChunk.section,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
