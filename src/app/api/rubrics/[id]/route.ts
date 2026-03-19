import { NextRequest, NextResponse } from 'next/server';
import { getRubricById, saveRubric, deleteRubric } from '@/lib/data';
import { isAuthenticated } from '@/lib/auth';

interface RouteParams {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const rubric = await getRubricById(params.id);
    if (!rubric) {
      return NextResponse.json({ error: 'Rubrica nu a fost găsită' }, { status: 404 });
    }
    return NextResponse.json(rubric);
  } catch {
    return NextResponse.json({ error: 'Eroare la citire' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const existing = await getRubricById(params.id);

    if (!existing) {
      return NextResponse.json({ error: 'Rubrica nu a fost găsită' }, { status: 404 });
    }

    const updated = { ...existing, ...body };
    await saveRubric(updated);
    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Eroare la actualizare' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
  }

  try {
    const existing = await getRubricById(params.id);
    if (!existing) {
      return NextResponse.json({ error: 'Rubrica nu a fost găsită' }, { status: 404 });
    }
    await deleteRubric(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Eroare la ștergere' }, { status: 500 });
  }
}
