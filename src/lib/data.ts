import { sql } from './db';
import { Trip, Rubric, ContactInfo } from '@/types';

// ─── Row mappers ──────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToRubric(row: any): Rubric {
  return {
    id:          row.id,
    name:        row.name,
    slug:        row.slug,
    description: row.description ?? '',
    icon:        row.icon ?? 'Star',
    color:       row.color ?? '#0f2b46',
    image:       row.image ?? '',
    createdAt:   row.created_at ?? '',
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToTrip(row: any): Trip {
  return {
    id:               row.id,
    title:            row.title,
    slug:             row.slug,
    description:      row.description ?? '',
    shortDescription: row.short_description ?? '',
    rubricId:         row.rubric_id ?? '',
    rubricSlug:       row.rubric_slug ?? '',
    price:            Number(row.price) ?? 0,
    duration:         row.duration ?? '',
    groupSize:        row.group_size ?? '',
    destination:      row.destination ?? '',
    departureFrom:    row.departure_from ?? 'Brașov',
    includes:         row.includes ?? [],
    excludes:         row.excludes ?? [],
    itinerary:        row.itinerary ?? [],
    images:           row.images ?? [],
    featured:         Boolean(row.featured),
    difficulty:       row.difficulty ?? 'Ușor',
    nextDeparture:    row.next_departure ?? '',
    createdAt:        row.created_at ?? '',
  };
}

// ─── Rubrics ──────────────────────────────────────────────────────────────────

export async function getRubrics(): Promise<Rubric[]> {
  const rows = await sql`SELECT * FROM rubrics ORDER BY created_at ASC`;
  return rows.map(rowToRubric);
}

export async function getRubricBySlug(slug: string): Promise<Rubric | undefined> {
  const rows = await sql`SELECT * FROM rubrics WHERE slug = ${slug} LIMIT 1`;
  return rows.length > 0 ? rowToRubric(rows[0]) : undefined;
}

export async function getRubricById(id: string): Promise<Rubric | undefined> {
  const rows = await sql`SELECT * FROM rubrics WHERE id = ${id} LIMIT 1`;
  return rows.length > 0 ? rowToRubric(rows[0]) : undefined;
}

export async function saveRubric(rubric: Rubric): Promise<void> {
  await sql`
    INSERT INTO rubrics (id, name, slug, description, icon, color, image, created_at)
    VALUES (${rubric.id}, ${rubric.name}, ${rubric.slug}, ${rubric.description},
            ${rubric.icon}, ${rubric.color}, ${rubric.image}, ${rubric.createdAt})
    ON CONFLICT (id) DO UPDATE SET
      name        = EXCLUDED.name,
      slug        = EXCLUDED.slug,
      description = EXCLUDED.description,
      icon        = EXCLUDED.icon,
      color       = EXCLUDED.color,
      image       = EXCLUDED.image
  `;
}

export async function deleteRubric(id: string): Promise<void> {
  await sql`DELETE FROM rubrics WHERE id = ${id}`;
}

// ─── Trips ────────────────────────────────────────────────────────────────────

export async function getTrips(): Promise<Trip[]> {
  const rows = await sql`SELECT * FROM trips ORDER BY created_at DESC`;
  return rows.map(rowToTrip);
}

export async function getTripBySlug(slug: string): Promise<Trip | undefined> {
  const rows = await sql`SELECT * FROM trips WHERE slug = ${slug} LIMIT 1`;
  return rows.length > 0 ? rowToTrip(rows[0]) : undefined;
}

export async function getTripById(id: string): Promise<Trip | undefined> {
  const rows = await sql`SELECT * FROM trips WHERE id = ${id} LIMIT 1`;
  return rows.length > 0 ? rowToTrip(rows[0]) : undefined;
}

export async function saveTrip(trip: Trip): Promise<void> {
  await sql`
    INSERT INTO trips (
      id, title, slug, description, short_description,
      rubric_id, rubric_slug, price, duration, group_size,
      destination, departure_from, includes, excludes,
      itinerary, images, featured, difficulty, next_departure, created_at
    ) VALUES (
      ${trip.id}, ${trip.title}, ${trip.slug}, ${trip.description}, ${trip.shortDescription},
      ${trip.rubricId}, ${trip.rubricSlug}, ${trip.price}, ${trip.duration}, ${trip.groupSize},
      ${trip.destination}, ${trip.departureFrom},
      ${JSON.stringify(trip.includes)}::jsonb, ${JSON.stringify(trip.excludes)}::jsonb,
      ${JSON.stringify(trip.itinerary)}::jsonb, ${JSON.stringify(trip.images)}::jsonb,
      ${trip.featured}, ${trip.difficulty}, ${trip.nextDeparture}, ${trip.createdAt}
    )
    ON CONFLICT (id) DO UPDATE SET
      title            = EXCLUDED.title,
      slug             = EXCLUDED.slug,
      description      = EXCLUDED.description,
      short_description = EXCLUDED.short_description,
      rubric_id        = EXCLUDED.rubric_id,
      rubric_slug      = EXCLUDED.rubric_slug,
      price            = EXCLUDED.price,
      duration         = EXCLUDED.duration,
      group_size       = EXCLUDED.group_size,
      destination      = EXCLUDED.destination,
      departure_from   = EXCLUDED.departure_from,
      includes         = EXCLUDED.includes,
      excludes         = EXCLUDED.excludes,
      itinerary        = EXCLUDED.itinerary,
      images           = EXCLUDED.images,
      featured         = EXCLUDED.featured,
      difficulty       = EXCLUDED.difficulty,
      next_departure   = EXCLUDED.next_departure
  `;
}

export async function deleteTrip(id: string): Promise<void> {
  await sql`DELETE FROM trips WHERE id = ${id}`;
}

// ─── Contact ──────────────────────────────────────────────────────────────────

export async function getContact(): Promise<ContactInfo> {
  const rows = await sql`SELECT * FROM contact WHERE id = 1`;
  if (rows.length === 0) {
    return {
      phone: '',
      phones: [],
      email: '',
      address: '',
      facebook: '',
      instagram: '',
      scheduleWeekdays: '',
      scheduleSaturday: '',
    };
  }
  const row = rows[0];
  return {
    phone:             row.phone ?? '',
    phones:            row.phones ?? [],
    email:             row.email ?? '',
    address:           row.address ?? '',
    facebook:          row.facebook ?? '',
    instagram:         row.instagram ?? '',
    scheduleWeekdays:  row.schedule_weekdays ?? '',
    scheduleSaturday:  row.schedule_saturday ?? '',
  };
}

export async function saveContact(contact: ContactInfo): Promise<void> {
  await sql`
    INSERT INTO contact (id, phone, phones, email, address, facebook, instagram, schedule_weekdays, schedule_saturday)
    VALUES (1, ${contact.phone}, ${JSON.stringify(contact.phones)}::jsonb,
            ${contact.email}, ${contact.address}, ${contact.facebook}, ${contact.instagram},
            ${contact.scheduleWeekdays}, ${contact.scheduleSaturday})
    ON CONFLICT (id) DO UPDATE SET
      phone              = EXCLUDED.phone,
      phones             = EXCLUDED.phones,
      email              = EXCLUDED.email,
      address            = EXCLUDED.address,
      facebook           = EXCLUDED.facebook,
      instagram          = EXCLUDED.instagram,
      schedule_weekdays  = EXCLUDED.schedule_weekdays,
      schedule_saturday  = EXCLUDED.schedule_saturday
  `;
}
