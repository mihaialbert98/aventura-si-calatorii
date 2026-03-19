import { NextRequest, NextResponse } from 'next/server';
import { getRubrics, saveRubrics } from '@/lib/data';
import { isAuthenticated } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import { Rubric } from '@/types';

export async function GET() {
  try {
    const rubrics = getRubrics();
    return NextResponse.json(rubrics);
  } catch {
    return NextResponse.json({ error: 'Eroare la citire' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const slug = (body.name as string)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const newRubric: Rubric = {
      id: uuidv4(),
      name: body.name,
      slug,
      description: body.description || '',
      icon: body.icon || 'Star',
      color: body.color || '#0f2b46',
      image: body.image || '',
      createdAt: new Date().toISOString(),
    };

    const rubrics = getRubrics();
    rubrics.push(newRubric);
    saveRubrics(rubrics);

    return NextResponse.json(newRubric, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Eroare la creare' }, { status: 500 });
  }
}
