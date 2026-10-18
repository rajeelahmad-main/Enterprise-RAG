import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, findUserByEmail } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const tokenCookie = req.cookies.get('auth_token')?.value;
    const authHeader = req.headers.get('authorization')?.replace('Bearer ', '');
    const token = tokenCookie || authHeader;

    if (!token) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const user = findUserByEmail(payload.email);
    if (!user) {
      return NextResponse.json({
        authenticated: true,
        user: {
          id: payload.userId,
          name: payload.name,
          email: payload.email,
          role: payload.role,
          department: payload.department,
        },
      });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
