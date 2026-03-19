import { NextRequest, NextResponse } from 'next/server';
import { getRubrics, saveRubrics } from '@/lib/data';
import { isAuthenticated } from '@/lib/auth';

interface RouteParams {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const rubrics = getRubrics();
    const rubric = rubrics.find((r) => r.id === params.id);
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
    const rubrics = getRubrics();
    const idx = rubrics.findIndex((r) => r.id === params.id);

    if (idx === -1) {
      return NextResponse.json({ error: 'Rubrica nu a fost găsită' }, { status: 404 });
    }

    const updated = { ...rubrics[idx], ...body };
    rubrics[idx] = updated;
    saveRubrics(rubrics);

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Eroare la actualizare' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
  }

  try {
    const rubrics = getRubrics();
    const filtered = rubrics.filter((r) => r.id !== params.id);

    if (filtered.length === rubrics.length) {
      return NextResponse.json({ error: 'Rubrica nu a fost găsită' }, { status: 404 });
    }

    saveRubrics(filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Eroare la ștergere' }, { status: 500 });
  }
}
