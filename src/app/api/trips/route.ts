import { NextRequest, NextResponse } from 'next/server';
import { getTrips, saveTrip, getRubricById } from '@/lib/data';
import { isAuthenticated } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import { Trip } from '@/types';

export async function GET() {
  try {
    const trips = await getTrips();
    return NextResponse.json(trips);
  } catch {
    return NextResponse.json({ error: 'Eroare la citirea datelor' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const rubric = await getRubricById(body.rubricId);

    const slug = (body.title as string)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const newTrip: Trip = {
      id:               uuidv4(),
      title:            body.title,
      slug,
      description:      body.description || '',
      shortDescription: body.shortDescription || '',
      rubricId:         body.rubricId,
      rubricSlug:       rubric?.slug || '',
      price:            Number(body.price) || 0,
      duration:         body.duration || '',
      groupSize:        body.groupSize || '',
      destination:      body.destination || '',
      departureFrom:    body.departureFrom || 'Brașov',
      includes:         Array.isArray(body.includes) ? body.includes : [],
      excludes:         Array.isArray(body.excludes) ? body.excludes : [],
      itinerary:        Array.isArray(body.itinerary) ? body.itinerary : [],
      images:           Array.isArray(body.images) ? body.images : [],
      featured:         Boolean(body.featured),
      difficulty:       body.difficulty || 'Ușor',
      nextDeparture:    body.nextDeparture ? new Date(body.nextDeparture).toISOString() : new Date().toISOString(),
      createdAt:        new Date().toISOString(),
    };

    await saveTrip(newTrip);
    return NextResponse.json(newTrip, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Eroare la creare' }, { status: 500 });
  }
}
