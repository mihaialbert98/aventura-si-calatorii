export interface Rubric {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string; // lucide icon name
  color: string;
  image: string;
  createdAt: string;
}

export interface Trip {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  rubricId: string;
  rubricSlug: string;
  price: number;
  duration: string; // e.g. "3 zile / 2 nopți"
  groupSize: string; // e.g. "20-45 persoane"
  destination: string;
  departureFrom: string;
  includes: string[]; // what's included
  excludes: string[]; // what's not included
  itinerary: { day: string; description: string }[];
  images: string[]; // array of image URLs
  featured: boolean;
  difficulty: 'Ușor' | 'Moderat' | 'Dificil';
  nextDeparture: string; // ISO date string
  createdAt: string;
}

export interface ContactInfo {
  phone: string;           // primary phone
  phones: string[];        // secondary phones
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  scheduleWeekdays: string;
  scheduleSaturday: string;
}
