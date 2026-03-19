import fs from 'fs';
import path from 'path';
import { Trip, Rubric, ContactInfo } from '@/types';

const dataDir = path.join(process.cwd(), 'src/data');

export function getRubrics(): Rubric[] {
  const file = fs.readFileSync(path.join(dataDir, 'rubrics.json'), 'utf-8');
  return JSON.parse(file);
}

export function saveRubrics(rubrics: Rubric[]): void {
  fs.writeFileSync(path.join(dataDir, 'rubrics.json'), JSON.stringify(rubrics, null, 2));
}

export function getTrips(): Trip[] {
  const file = fs.readFileSync(path.join(dataDir, 'trips.json'), 'utf-8');
  return JSON.parse(file);
}

export function saveTrips(trips: Trip[]): void {
  fs.writeFileSync(path.join(dataDir, 'trips.json'), JSON.stringify(trips, null, 2));
}

export function getTripBySlug(slug: string): Trip | undefined {
  return getTrips().find(t => t.slug === slug);
}

export function getRubricBySlug(slug: string): Rubric | undefined {
  return getRubrics().find(r => r.slug === slug);
}

export function getContact(): ContactInfo {
  const file = fs.readFileSync(path.join(dataDir, 'contact.json'), 'utf-8');
  return JSON.parse(file);
}

export function saveContact(contact: ContactInfo): void {
  fs.writeFileSync(path.join(dataDir, 'contact.json'), JSON.stringify(contact, null, 2));
}
