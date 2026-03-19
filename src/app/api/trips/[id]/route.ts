import { NextRequest, NextResponse } from 'next/server';
import { getTripById, saveTrip, deleteTrip, getRubricById } from '@/lib/data';
import { isAuthenticated } from '@/lib/auth';

interface RouteParams {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const trip = await getTripById(params.id);
    if (!trip) {
      return NextResponse.json({ error: 'Excursia nu a fost găsită' }, { status: 404 });
    }
    return NextResponse.json(trip);
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
    const existing = await getTripById(params.id);

    if (!existing) {
      return NextResponse.json({ error: 'Excursia nu a fost găsită' }, { status: 404 });
    }

    const rubric = body.rubricId ? await getRubricById(body.rubricId) : null;

    const updated = {
      ...existing,
      ...body,
      price:         body.price !== undefined ? Number(body.price) : existing.price,
      rubricSlug:    rubric?.slug ?? existing.rubricSlug,
      nextDeparture: body.nextDeparture ? new Date(body.nextDeparture).toISOString() : existing.nextDeparture,
      includes:      Array.isArray(body.includes) ? body.includes : existing.includes,
      excludes:      Array.isArray(body.excludes) ? body.excludes : existing.excludes,
      images:        Array.isArray(body.images) ? body.images : existing.images,
    };

    await saveTrip(updated);
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
    const existing = await getTripById(params.id);
    if (!existing) {
      return NextResponse.json({ error: 'Excursia nu a fost găsită' }, { status: 404 });
    }
    await deleteTrip(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Eroare la ștergere' }, { status: 500 });
  }
}
