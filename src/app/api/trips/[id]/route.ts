import { NextRequest, NextResponse } from 'next/server';
import { getTrips, saveTrips, getRubrics } from '@/lib/data';
import { isAuthenticated } from '@/lib/auth';

interface RouteParams {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const trips = getTrips();
    const trip = trips.find((t) => t.id === params.id);
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
    const trips = getTrips();
    const idx = trips.findIndex((t) => t.id === params.id);

    if (idx === -1) {
      return NextResponse.json({ error: 'Excursia nu a fost găsită' }, { status: 404 });
    }

    const rubrics = getRubrics();
    const rubric = rubrics.find((r) => r.id === body.rubricId);

    const updated = {
      ...trips[idx],
      ...body,
      price: body.price !== undefined ? Number(body.price) : trips[idx].price,
      rubricSlug: rubric?.slug || trips[idx].rubricSlug,
      nextDeparture: body.nextDeparture
        ? new Date(body.nextDeparture).toISOString()
        : trips[idx].nextDeparture,
      includes: Array.isArray(body.includes) ? body.includes : trips[idx].includes,
      excludes: Array.isArray(body.excludes) ? body.excludes : trips[idx].excludes,
      images: Array.isArray(body.images) ? body.images : trips[idx].images,
    };

    trips[idx] = updated;
    saveTrips(trips);

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
    const trips = getTrips();
    const filtered = trips.filter((t) => t.id !== params.id);

    if (filtered.length === trips.length) {
      return NextResponse.json({ error: 'Excursia nu a fost găsită' }, { status: 404 });
    }

    saveTrips(filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Eroare la ștergere' }, { status: 500 });
  }
}
