import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromCookies } from '@/lib/auth';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string; userId: string }> }) {
  try {
    const { id: projectId, userId } = await params;
    const user = await getUserFromCookies();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await prisma.projectMember.delete({
      where: { projectId_userId: { projectId, userId } }
    });

    return NextResponse.json({ message: 'Member removed' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
