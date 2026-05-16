import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { taskSchema } from '@/lib/schemas';
import { getUserFromCookies } from '@/lib/auth';

const patchSchema = taskSchema.partial();

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getUserFromCookies();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: { include: { members: true } } }
    });
    if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (user.role !== 'ADMIN') {
      const isMember = task.project.members.some(m => m.userId === user.id);
      if (!isMember) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: (parsed.error as any).errors[0].message }, { status: 400 });

    const updatedTask = await prisma.task.update({
      where: { id },
      data: parsed.data,
      include: { assignedTo: { select: { id: true, name: true } } }
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getUserFromCookies();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (user.role !== 'ADMIN' && task.createdById !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ message: 'Task deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
