import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { taskSchema } from '@/lib/schemas';
import { getUserFromCookies } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getUserFromCookies();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let tasks;
    if (user.role === 'ADMIN') {
      tasks = await prisma.task.findMany({
        include: {
          project: { select: { id: true, name: true } },
          assignedTo: { select: { id: true, name: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      tasks = await prisma.task.findMany({
        where: {
          OR: [
            { assignedToId: user.id },
            { project: { members: { some: { userId: user.id } } } }
          ]
        },
        include: {
          project: { select: { id: true, name: true } },
          assignedTo: { select: { id: true, name: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromCookies();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const parsed = taskSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: (parsed.error as any).errors[0].message }, { status: 400 });

    const { projectId } = parsed.data;

    if (user.role !== 'ADMIN') {
      const member = await prisma.projectMember.findUnique({
        where: { projectId_userId: { projectId, userId: user.id } }
      });
      if (!member) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const task = await prisma.task.create({
      data: { ...parsed.data, createdById: user.id },
      include: {
        assignedTo: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } }
      }
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
