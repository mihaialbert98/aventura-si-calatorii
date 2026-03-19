import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getRubrics, getTrips, getRubricBySlug, getContact } from '@/lib/data';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import TripCard from '@/components/TripCard/TripCard';
import AnimatedSection from '@/components/AnimatedSection/AnimatedSection';
import { GraduationCap, Heart, Bus } from 'lucide-react';
import styles from './RubricPage.module.scss';

const iconMap: Record<string, React.ElementType> = {
  GraduationCap,
  Heart,
  Bus,
};

interface PageProps {
  params: { rubricSlug: string };
}

export async function generateStaticParams() {
  const rubrics = await getRubrics();
  return rubrics.map((r) => ({ rubricSlug: r.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const rubric = await getRubricBySlug(params.rubricSlug);
  if (!rubric) return { title: 'Pagina negăsită' };
  return {
    title: `${rubric.name} — Aventură și Călătorii`,
    description: rubric.description,
  };
}

export default async function RubricPage({ params }: PageProps) {
  const rubric = await getRubricBySlug(params.rubricSlug);
  if (!rubric) notFound();

  const allTrips = await getTrips();
  const rubricTrips = allTrips.filter((t) => t.rubricSlug === params.rubricSlug);
  const contact = await getContact();
  const Icon = iconMap[rubric.icon] || Bus;

  return (
    <>
      <Navbar phone={contact.phone} />
      <main>
        {/* Hero Banner */}
        <section className={styles.hero}>
          <div className={styles.heroBg}>
            <Image
              src={rubric.image}
              alt={rubric.name}
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className={styles.heroOverlay} />
          <div className={styles.heroContent}>
            <AnimatedSection>
              <div
                className={styles.heroIcon}
                style={{ background: `${rubric.color}33`, borderColor: `${rubric.color}66` }}
              >
                <Icon size={36} style={{ color: rubric.color }} />
              </div>
              <h1 className={styles.heroTitle}>{rubric.name}</h1>
              <p className={styles.heroDesc}>{rubric.description}</p>
              <div className={styles.heroBadge}>
                <span>{rubricTrips.length} excursii disponibile</span>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Trips Grid */}
        <section className={styles.tripsSection}>
          <div className={styles.container}>
            {rubricTrips.length > 0 ? (
              <>
                <AnimatedSection>
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionLine} />
                    <h2 className={styles.sectionTitle}>
                      Excursii disponibile în <span style={{ color: rubric.color }}>{rubric.name}</span>
                    </h2>
                    <p className={styles.sectionSubtitle}>
                      Toate excursiile includ transport cu autocar modern, ghid specializat și asigurare.
                    </p>
                  </div>
                </AnimatedSection>
                <div className={styles.tripsGrid}>
                  {rubricTrips.map((trip, i) => (
                    <TripCard key={trip.id} trip={trip} rubricName={rubric.name} index={i} />
                  ))}
                </div>
              </>
            ) : (
              <div className={styles.empty}>
                <Icon size={64} />
                <h3>Nu există excursii disponibile momentan</h3>
                <p>Reveniți în curând pentru noi oferte sau contactați-ne pentru un circuit personalizat.</p>
              </div>
            )}
          </div>
        </section>

        {/* Info banner */}
        <section className={styles.infoBanner}>
          <div className={styles.container}>
            <div className={styles.infoGrid}>
              <AnimatedSection className={styles.infoItem}>
                <span className={styles.infoIcon}>🚌</span>
                <h4>Transport Inclus</h4>
                <p>Autocar modern cu aer condiționat, WiFi și confort premium</p>
              </AnimatedSection>
              <AnimatedSection delay={0.1} className={styles.infoItem}>
                <span className={styles.infoIcon}>🎓</span>
                <h4>Ghid Specializat</h4>
                <p>Ghizi autorizați, pasionați și cu experiență vastă</p>
              </AnimatedSection>
              <AnimatedSection delay={0.2} className={styles.infoItem}>
                <span className={styles.infoIcon}>🛡️</span>
                <h4>Asigurare Completă</h4>
                <p>Asigurare pentru pasageri și bagaje pe orice rută</p>
              </AnimatedSection>
              <AnimatedSection delay={0.3} className={styles.infoItem}>
                <span className={styles.infoIcon}>💳</span>
                <h4>Prețuri Transparente</h4>
                <p>Fără costuri ascunse. Ce vedeți este ce plătiți.</p>
              </AnimatedSection>
            </div>
          </div>
        </section>
      </main>
      <Footer contact={contact} />
    </>
  );
}
