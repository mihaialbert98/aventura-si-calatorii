import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // ─── Create tables ────────────────────────────────────────────────────────
    await sql`
      CREATE TABLE IF NOT EXISTS rubrics (
        id          TEXT PRIMARY KEY,
        name        TEXT NOT NULL,
        slug        TEXT UNIQUE NOT NULL,
        description TEXT    DEFAULT '',
        icon        TEXT    DEFAULT 'Star',
        color       TEXT    DEFAULT '#0f2b46',
        image       TEXT    DEFAULT '',
        created_at  TEXT    DEFAULT ''
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS trips (
        id               TEXT PRIMARY KEY,
        title            TEXT NOT NULL,
        slug             TEXT UNIQUE NOT NULL,
        description      TEXT    DEFAULT '',
        short_description TEXT   DEFAULT '',
        rubric_id        TEXT,
        rubric_slug      TEXT    DEFAULT '',
        price            INTEGER DEFAULT 0,
        duration         TEXT    DEFAULT '',
        group_size       TEXT    DEFAULT '',
        destination      TEXT    DEFAULT '',
        departure_from   TEXT    DEFAULT 'Brașov',
        includes         JSONB   DEFAULT '[]',
        excludes         JSONB   DEFAULT '[]',
        itinerary        JSONB   DEFAULT '[]',
        images           JSONB   DEFAULT '[]',
        featured         BOOLEAN DEFAULT false,
        difficulty       TEXT    DEFAULT 'Ușor',
        next_departure   TEXT    DEFAULT '',
        created_at       TEXT    DEFAULT ''
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS contact (
        id                INTEGER PRIMARY KEY DEFAULT 1,
        phone             TEXT DEFAULT '',
        phones            JSONB DEFAULT '[]',
        email             TEXT DEFAULT '',
        address           TEXT DEFAULT '',
        facebook          TEXT DEFAULT '',
        instagram         TEXT DEFAULT '',
        schedule_weekdays TEXT DEFAULT '',
        schedule_saturday TEXT DEFAULT ''
      )
    `;

    // ─── Seed rubrics (upsert) ────────────────────────────────────────────────
    const rubrics = [
      {
        id: '1', name: 'Excursii Școlare', slug: 'excursii-scolare',
        description: 'Excursii educative și de aventură pentru elevi și studenți, cu ghizi specializați și programe adaptate vârstei.',
        icon: 'GraduationCap', color: '#1a9e6e',
        image: 'https://images.unsplash.com/photo-1530099486328-e021101a494a?w=800',
        created_at: '2024-01-01T00:00:00.000Z',
      },
      {
        id: '2', name: 'Excursii Seniori', slug: 'excursii-seniori',
        description: 'Tururi relaxante și culturale pentru seniori, cu confort maxim și ritmul adaptat fiecărui grup.',
        icon: 'Heart', color: '#e8923a',
        image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
        created_at: '2024-01-01T00:00:00.000Z',
      },
      {
        id: '3', name: 'Închiriere Autocare', slug: 'inchiriere-autocare',
        description: 'Autocare moderne pentru transport grup, cu șoferi profesioniști și confort premium pe orice rută.',
        icon: 'Bus', color: '#0f2b46',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800',
        created_at: '2024-01-01T00:00:00.000Z',
      },
    ];

    for (const r of rubrics) {
      await sql`
        INSERT INTO rubrics (id, name, slug, description, icon, color, image, created_at)
        VALUES (${r.id}, ${r.name}, ${r.slug}, ${r.description}, ${r.icon}, ${r.color}, ${r.image}, ${r.created_at})
        ON CONFLICT (id) DO NOTHING
      `;
    }

    // ─── Seed trips (upsert) ──────────────────────────────────────────────────
    const trips = [
      {
        id: '2', title: 'Sinaia & Castelul Peleș', slug: 'sinaia-castelul-peles',
        description: 'O zi memorabilă la perla Carpaților — Sinaia. Elevii vor vizita fascinantul Castel Peleș, una dintre cele mai frumoase reședințe regale din Europa, și vor descoperi Mănăstirea Sinaia cu bogata sa istorie.',
        short_description: 'Regele munților și bijuteria arhitecturală a Castelului Peleș vă așteaptă.',
        rubric_id: '1', rubric_slug: 'excursii-scolare', price: 95,
        duration: '1 zi', group_size: '20-50 elevi', destination: 'Sinaia, Prahova', departure_from: 'Brașov',
        includes: ['Transport autocar', 'Ghid specializat', 'Bilete intrare Peleș', 'Asigurare'],
        excludes: ['Masa', 'Cheltuieli personale', 'Bilete opționale Pelișor'],
        itinerary: [
          { day: 'Dimineața', description: 'Plecare din Brașov, sosire la Mănăstirea Sinaia, tur 45 min' },
          { day: 'Prânz', description: 'Vizita Castelului Peleș — tur ghidat complet (2h)' },
          { day: 'După-amiaza', description: 'Timp liber în Sinaia, plimbare pe Calea Victoriei, retur' },
        ],
        images: ['https://images.unsplash.com/photo-1562986234-5c4b6e8c3e01?w=800', 'https://images.unsplash.com/photo-1604131879849-b76a1f01bc9f?w=800'],
        featured: true, difficulty: 'Ușor', next_departure: '2025-04-22T08:00:00.000Z', created_at: '2024-01-12T00:00:00.000Z',
      },
      {
        id: '3', title: 'Circuit Mănăstiri Moldova', slug: 'circuit-manastiri-moldova',
        description: 'Un circuit de 3 zile prin Moldova, vizitând celebrele mănăstiri pictate înscrise în patrimoniul UNESCO: Voroneț, Sucevița, Moldovița și Humor.',
        short_description: 'Frescele bizantine ale Moldovei — o călătorie spirituală de neuitat.',
        rubric_id: '2', rubric_slug: 'excursii-seniori', price: 380,
        duration: '3 zile / 2 nopți', group_size: '20-40 persoane', destination: 'Suceava & Neamț, Moldova', departure_from: 'Brașov',
        includes: ['Transport autocar premium', 'Cazare 2 nopți (3*)', 'Mic dejun zilnic', 'Ghid specializat', 'Bilete intrare', 'Asigurare'],
        excludes: ['Prânz și cină', 'Cheltuieli personale'],
        itinerary: [
          { day: 'Ziua 1', description: 'Plecare Brașov, Mănăstirea Neamț, sosire Suceava, cazare' },
          { day: 'Ziua 2', description: 'Voroneț, Humor, Moldovița — turul mănăstirilor pictate UNESCO' },
          { day: 'Ziua 3', description: 'Sucevița, Cetatea Sucevei, retur Brașov seara' },
        ],
        images: ['https://images.unsplash.com/photo-1555993539-1732b0258235?w=800', 'https://images.unsplash.com/photo-1548813831-5e8be31b5ed9?w=800'],
        featured: true, difficulty: 'Ușor', next_departure: '2025-05-10T07:00:00.000Z', created_at: '2024-01-15T00:00:00.000Z',
      },
      {
        id: '1', title: 'Castelul Bran și Râșnov', slug: 'castelul-bran-si-rasnov',
        description: 'O excursie fascinantă pentru elevi la cele mai iconice castele din Transilvania.',
        short_description: 'Explorați misterele Castelului Bran și panoramele spectaculoase de la Cetatea Râșnov.',
        rubric_id: '1', rubric_slug: 'excursii-scolare', price: 85,
        duration: '1 zi', group_size: '20-50 elevi', destination: 'Bran & Râșnov, Brașov', departure_from: 'Brașov',
        includes: ['Transport autocar', 'Ghid specializat', 'Bilete de intrare', 'Asigurare'],
        excludes: ['Masa', 'Cheltuieli personale'],
        itinerary: [
          { day: 'Dimineața', description: 'Plecare din Brașov, sosire la Castelul Bran, tur ghidat (2h)' },
          { day: 'Prânz', description: 'Timp liber în zona Bran, masă opțională la restaurantele locale' },
          { day: 'După-amiaza', description: 'Vizita Cetății Râșnov, priveliști panoramice, retur Brașov' },
        ],
        images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Bran_Castle%2C_Romania.jpg/1280px-Bran_Castle%2C_Romania.jpg'],
        featured: false, difficulty: 'Ușor', next_departure: '2025-04-15T00:00:00.000Z', created_at: '2024-01-10T00:00:00.000Z',
      },
      {
        id: '4', title: 'Delta Dunării — Paradisul Păsărilor', slug: 'delta-dunarii-paradisul-pasarilor',
        description: '5 zile de relaxare și descoperire în cea mai mare deltă din Europa, UNESCO.',
        short_description: 'Cea mai spectaculoasă biodiversitate din Europa, la doar o zi de Brașov.',
        rubric_id: '2', rubric_slug: 'excursii-seniori', price: 650,
        duration: '5 zile / 4 nopți', group_size: '15-30 persoane', destination: 'Tulcea & Delta Dunării', departure_from: 'Brașov',
        includes: ['Transport autocar', 'Cazare 4 nopți pensiune', 'Pensiune completă', 'Croaziere zilnice', 'Ghid ornitolog', 'Asigurare'],
        excludes: ['Băuturi alcoolice', 'Cheltuieli personale'],
        itinerary: [
          { day: 'Ziua 1', description: 'Brașov → Tulcea, transfer la pensiune în deltă, cină de bun venit' },
          { day: 'Ziua 2-3', description: 'Croaziere prin brațele Sulina și Sfântu Gheorghe, observare faună' },
          { day: 'Ziua 4', description: 'Vizita Muzeului Deltei, sat pescăresc tradițional' },
          { day: 'Ziua 5', description: 'Mic dejun, retur Brașov' },
        ],
        images: ['https://images.unsplash.com/photo-1584553391547-fa4a6d46c879?w=800'],
        featured: false, difficulty: 'Ușor', next_departure: '2025-06-05T07:00:00.000Z', created_at: '2024-01-20T00:00:00.000Z',
      },
      {
        id: '5', title: 'Transfer Aeroport & Evenimente', slug: 'transfer-aeroport-evenimente',
        description: 'Servicii profesionale de transport grup pentru transferuri aeroportuare, nunți, conferințe și team building-uri.',
        short_description: 'Transport premium pentru grupuri — de la 15 la 55 de persoane.',
        rubric_id: '3', rubric_slug: 'inchiriere-autocare', price: 150,
        duration: 'La cerere', group_size: '15-55 persoane', destination: 'Oriunde în România', departure_from: 'Brașov',
        includes: ['Șofer profesionist licențiat', 'Combustibil', 'Asigurare pasageri și bagaje', 'Aer condiționat', 'WiFi la bord'],
        excludes: ['Taxe de drum și parcare', 'Servicii adiționale'],
        itinerary: [],
        images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800'],
        featured: false, difficulty: 'Ușor', next_departure: '2025-04-01T00:00:00.000Z', created_at: '2024-01-25T00:00:00.000Z',
      },
      {
        id: '6', title: 'Circuit Turistic Personalizat', slug: 'circuit-turistic-personalizat',
        description: 'Proiectați propriul circuit turistic! Alegem împreună destinațiile, durata și programul.',
        short_description: 'Itinerarul tău, autocarul nostru. Flexibilitate maximă pentru grupul tău.',
        rubric_id: '3', rubric_slug: 'inchiriere-autocare', price: 200,
        duration: 'Flexibil', group_size: '25-55 persoane', destination: 'La alegere', departure_from: 'Brașov',
        includes: ['Autocar 45-55 locuri', 'Șofer profesionist', 'Combustibil', 'Asigurare completă', 'GPS & monitorizare'],
        excludes: ['Ghid turistic', 'Cazare', 'Masă', 'Taxe intrare obiective'],
        itinerary: [],
        images: ['https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800'],
        featured: true, difficulty: 'Ușor', next_departure: '2025-04-01T00:00:00.000Z', created_at: '2024-01-28T00:00:00.000Z',
      },
    ];

    for (const t of trips) {
      await sql`
        INSERT INTO trips (
          id, title, slug, description, short_description, rubric_id, rubric_slug,
          price, duration, group_size, destination, departure_from,
          includes, excludes, itinerary, images,
          featured, difficulty, next_departure, created_at
        ) VALUES (
          ${t.id}, ${t.title}, ${t.slug}, ${t.description}, ${t.short_description},
          ${t.rubric_id}, ${t.rubric_slug}, ${t.price}, ${t.duration}, ${t.group_size},
          ${t.destination}, ${t.departure_from},
          ${JSON.stringify(t.includes)}::jsonb, ${JSON.stringify(t.excludes)}::jsonb,
          ${JSON.stringify(t.itinerary)}::jsonb, ${JSON.stringify(t.images)}::jsonb,
          ${t.featured}, ${t.difficulty}, ${t.next_departure}, ${t.created_at}
        )
        ON CONFLICT (id) DO NOTHING
      `;
    }

    // ─── Seed contact ─────────────────────────────────────────────────────────
    await sql`
      INSERT INTO contact (id, phone, phones, email, address, facebook, instagram, schedule_weekdays, schedule_saturday)
      VALUES (1,
        '+40 123 456 789', ${JSON.stringify(['+40 987 654 321'])}::jsonb,
        'office@aventura-calatorii.ro', 'Strada Republicii nr. 12, Brașov, 500030',
        'https://facebook.com', 'https://instagram.com',
        'Luni – Vineri: 09:00 – 18:00', 'Sâmbătă: 10:00 – 14:00'
      )
      ON CONFLICT (id) DO NOTHING
    `;

    return NextResponse.json({ success: true, message: 'Database initialized and seeded successfully.' });
  } catch (err) {
    console.error('Seed error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
