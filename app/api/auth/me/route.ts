import { NextResponse } from 'next/server';
import { getUserFromCookies } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getUserFromCookies();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
