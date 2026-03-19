import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getTrips, getTripBySlug, getRubricBySlug, getContact } from '@/lib/data';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import AnimatedSection from '@/components/AnimatedSection/AnimatedSection';
import {
  ArrowLeft,
  Clock,
  Users,
  MapPin,
  Navigation,
  CheckCircle,
  XCircle,
  Calendar,
  Star,
  ChevronRight,
} from 'lucide-react';
import styles from './TripDetail.module.scss';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const trips = await getTrips();
  return trips.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const trip = await getTripBySlug(params.slug);
  if (!trip) return { title: 'Excursie negăsită' };
  return {
    title: `${trip.title} — Aventură și Călătorii`,
    description: trip.shortDescription,
  };
}

export default async function TripDetailPage({ params }: PageProps) {
  const trip = await getTripBySlug(params.slug);
  if (!trip) notFound();

  const rubric = await getRubricBySlug(trip.rubricSlug);
  const contact = await getContact();

  const formattedDate = new Date(trip.nextDeparture).toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <Navbar phone={contact.phone} />
      <main>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroBg}>
            <Image
              src={trip.images[0]}
              alt={trip.title}
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className={styles.heroOverlay} />
          <div className={styles.heroContent}>
            <Link href={`/${trip.rubricSlug}`} className={styles.backBtn}>
              <ArrowLeft size={16} />
              {rubric?.name || 'Înapoi'}
            </Link>
            <div className={styles.heroBadges}>
              {trip.featured && (
                <span className={styles.featuredBadge}>
                  <Star size={12} fill="currentColor" />
                  Recomandat
                </span>
              )}
              <span className={styles.difficultyBadge} data-difficulty={trip.difficulty}>
                {trip.difficulty}
              </span>
            </div>
            <h1 className={styles.heroTitle}>{trip.title}</h1>
            <div className={styles.heroMeta}>
              <span><MapPin size={15} /> {trip.destination}</span>
              <span><Clock size={15} /> {trip.duration}</span>
              <span><Users size={15} /> {trip.groupSize}</span>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className={styles.mainSection}>
          <div className={styles.container}>
            <div className={styles.layout}>
              {/* Left column */}
              <div className={styles.leftCol}>
                <AnimatedSection>
                  <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Despre această excursie</h2>
                    <p className={styles.description}>{trip.description}</p>
                  </div>
                </AnimatedSection>

                <AnimatedSection delay={0.1}>
                  <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Detalii excursie</h2>
                    <div className={styles.detailsGrid}>
                      <div className={styles.detailItem}>
                        <Clock size={20} className={styles.detailIcon} />
                        <div>
                          <span className={styles.detailLabel}>Durată</span>
                          <span className={styles.detailValue}>{trip.duration}</span>
                        </div>
                      </div>
                      <div className={styles.detailItem}>
                        <Users size={20} className={styles.detailIcon} />
                        <div>
                          <span className={styles.detailLabel}>Grup</span>
                          <span className={styles.detailValue}>{trip.groupSize}</span>
                        </div>
                      </div>
                      <div className={styles.detailItem}>
                        <MapPin size={20} className={styles.detailIcon} />
                        <div>
                          <span className={styles.detailLabel}>Destinație</span>
                          <span className={styles.detailValue}>{trip.destination}</span>
                        </div>
                      </div>
                      <div className={styles.detailItem}>
                        <Navigation size={20} className={styles.detailIcon} />
                        <div>
                          <span className={styles.detailLabel}>Plecare din</span>
                          <span className={styles.detailValue}>{trip.departureFrom}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>

                <AnimatedSection delay={0.15}>
                  <div className={styles.card}>
                    <div className={styles.includesGrid}>
                      <div className={styles.includesCol}>
                        <h3 className={styles.includesTitle}>
                          <CheckCircle size={18} className={styles.includeIcon} />
                          Ce include
                        </h3>
                        <ul className={styles.includesList}>
                          {trip.includes.map((item, i) => (
                            <li key={i} className={styles.includesItem}>
                              <CheckCircle size={14} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className={styles.excludesCol}>
                        <h3 className={styles.excludesTitle}>
                          <XCircle size={18} className={styles.excludeIcon} />
                          Nu include
                        </h3>
                        <ul className={styles.excludesList}>
                          {trip.excludes.map((item, i) => (
                            <li key={i} className={styles.excludesItem}>
                              <XCircle size={14} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>

                {trip.itinerary.length > 0 && (
                  <AnimatedSection delay={0.2}>
                    <div className={styles.card}>
                      <h2 className={styles.cardTitle}>Itinerar</h2>
                      <div className={styles.itinerary}>
                        {trip.itinerary.map((step, i) => (
                          <div key={i} className={styles.itineraryStep}>
                            <div className={styles.itineraryDot} />
                            {i < trip.itinerary.length - 1 && <div className={styles.itineraryLine} />}
                            <div className={styles.itineraryContent}>
                              <span className={styles.itineraryDay}>{step.day}</span>
                              <p className={styles.itineraryDesc}>{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AnimatedSection>
                )}

                {trip.images.length > 1 && (
                  <AnimatedSection delay={0.25}>
                    <div className={styles.card}>
                      <h2 className={styles.cardTitle}>Galerie foto</h2>
                      <div className={styles.gallery}>
                        {trip.images.map((img, i) => (
                          <div key={i} className={styles.galleryItem}>
                            <Image
                              src={img}
                              alt={`${trip.title} - foto ${i + 1}`}
                              fill
                              sizes="(max-width: 768px) 100vw, 400px"
                              style={{ objectFit: 'cover' }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </AnimatedSection>
                )}
              </div>

              {/* Right column — Sticky Booking Card */}
              <div className={styles.rightCol}>
                <div className={styles.bookingCard}>
                  <div className={styles.bookingPrice}>
                    <span className={styles.bookingFrom}>de la</span>
                    <span className={styles.bookingValue}>{trip.price} lei</span>
                    <span className={styles.bookingPer}>/persoană</span>
                  </div>

                  <div className={styles.bookingDivider} />

                  <div className={styles.bookingDetails}>
                    <div className={styles.bookingDetailRow}>
                      <Calendar size={16} />
                      <div>
                        <span className={styles.bookingDetailLabel}>Următoarea plecare</span>
                        <span className={styles.bookingDetailValue}>{formattedDate}</span>
                      </div>
                    </div>
                    <div className={styles.bookingDetailRow}>
                      <Clock size={16} />
                      <div>
                        <span className={styles.bookingDetailLabel}>Durată</span>
                        <span className={styles.bookingDetailValue}>{trip.duration}</span>
                      </div>
                    </div>
                    <div className={styles.bookingDetailRow}>
                      <Users size={16} />
                      <div>
                        <span className={styles.bookingDetailLabel}>Grup</span>
                        <span className={styles.bookingDetailValue}>{trip.groupSize}</span>
                      </div>
                    </div>
                  </div>

                  <Link href="/#contact" className={styles.bookingBtn}>
                    Rezervă Acum
                    <ChevronRight size={18} />
                  </Link>

                  <Link href={`tel:${contact.phone.replace(/\s/g, '')}`} className={styles.bookingCallBtn}>
                    📞 Sună pentru informații
                  </Link>

                  <p className={styles.bookingNote}>
                    Rezervare fără avans. Plata se efectuează la confirmarea locului.
                  </p>
                </div>

                {rubric && (
                  <div className={styles.rubricCard}>
                    <p className={styles.rubricCardLabel}>Categorie</p>
                    <Link href={`/${rubric.slug}`} className={styles.rubricCardLink}>
                      {rubric.name}
                      <ChevronRight size={16} />
                    </Link>
                    <p className={styles.rubricCardDesc}>{rubric.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer contact={contact} />
    </>
  );
}
