import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromCookies } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getUserFromCookies();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        _count: { select: { assignedTasks: true, projectMembers: true } }
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
