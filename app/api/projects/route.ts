import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { projectSchema } from '@/lib/schemas';
import { getUserFromCookies } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getUserFromCookies();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let projects;
    if (user.role === 'ADMIN') {
      projects = await prisma.project.findMany({
        include: {
          createdBy: { select: { name: true, email: true } },
          _count: { select: { tasks: true, members: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      projects = await prisma.project.findMany({
        where: { members: { some: { userId: user.id } } },
        include: {
          createdBy: { select: { name: true, email: true } },
          _count: { select: { tasks: true, members: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromCookies();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });

    const body = await req.json();
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: (parsed.error as any).errors[0].message }, { status: 400 });

    const project = await prisma.project.create({
      data: {
        name: parsed.data.name,
        description: parsed.data.description,
        createdById: user.id,
        members: { create: { userId: user.id } }
      }
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
