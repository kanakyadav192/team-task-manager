import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromCookies } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getUserFromCookies();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, email: true, role: true } } }
        },
        tasks: {
          include: { assignedTo: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (user.role !== 'ADMIN') {
      const isMember = project.members.some(m => m.userId === user.id);
      if (!isMember) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
