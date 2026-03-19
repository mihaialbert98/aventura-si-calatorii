import { NextRequest, NextResponse } from 'next/server';
import { getContact, saveContact } from '@/lib/data';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
  try {
    const contact = await getContact();
    return NextResponse.json(contact);
  } catch {
    return NextResponse.json({ error: 'Eroare internă' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
    }

    const body = await req.json();
    const contact = {
      phone:            body.phone || '',
      phones:           Array.isArray(body.phones) ? body.phones : [],
      email:            body.email || '',
      address:          body.address || '',
      facebook:         body.facebook || '',
      instagram:        body.instagram || '',
      scheduleWeekdays: body.scheduleWeekdays || '',
      scheduleSaturday: body.scheduleSaturday || '',
    };

    await saveContact(contact);
    return NextResponse.json(contact);
  } catch {
    return NextResponse.json({ error: 'Eroare internă' }, { status: 500 });
  }
}
