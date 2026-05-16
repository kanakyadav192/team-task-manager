import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromCookies } from '@/lib/auth';
import { memberSchema } from '@/lib/schemas';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params;
    const user = await getUserFromCookies();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const parsed = memberSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: (parsed.error as any).errors[0].message }, { status: 400 });

    const targetUser = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (!targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const existing = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: targetUser.id } }
    });
    if (existing) return NextResponse.json({ error: 'User is already a member' }, { status: 400 });

    const member = await prisma.projectMember.create({
      data: { projectId, userId: targetUser.id },
      include: { user: { select: { id: true, name: true, email: true, role: true } } }
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
