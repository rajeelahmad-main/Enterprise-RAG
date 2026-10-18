import { NextRequest, NextResponse } from 'next/server';
import { registerUser, generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, department, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const result = registerUser({
      name,
      email,
      password,
      department: department || 'General Employee',
      role: role === 'hr_admin' ? 'hr_admin' : 'employee',
    });

    if (!result.success || !result.user) {
      return NextResponse.json(
        { error: result.error || 'Failed to register' },
        { status: 400 }
      );
    }

    // Cast safeUser to generate token
    const token = generateToken(result.user as any);

    const response = NextResponse.json({
      success: true,
      user: result.user,
      token,
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
