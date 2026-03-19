import { getRubrics, getTrips, getContact } from '@/lib/data';
import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import Footer from '@/components/Footer/Footer';
import ServiceCard from '@/components/ServiceCard/ServiceCard';
import TripCard from '@/components/TripCard/TripCard';
import SectionTitle from '@/components/SectionTitle/SectionTitle';
import AnimatedSection from '@/components/AnimatedSection/AnimatedSection';
import HomeClient from './HomeClient';
import ContactForm from './ContactForm';
import styles from './HomePage.module.scss';

export default async function HomePage() {
  const rubrics = await getRubrics();
  const allTrips = await getTrips();
  const contact = await getContact();
  const featuredTrips = allTrips.filter((t) => t.featured);

  return (
    <>
      <Navbar phone={contact.phone} />
      <main>
        {/* Hero */}
        <Hero />

        {/* Services Section */}
        <section className={styles.servicesSection} id="servicii">
          <div className={styles.container}>
            <SectionTitle
              title="Serviciile Noastre"
              subtitle="Oferim experiențe de călătorie personalizate, adaptate fiecărui grup — de la excursii educaționale pentru elevi la tururi culturale pentru seniori."
              centered
              light
            />
            <div className={styles.servicesGrid}>
              {rubrics.map((rubric, i) => (
                <ServiceCard key={rubric.id} rubric={rubric} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Trips */}
        <section className={styles.tripsSection} id="excursii">
          <div className={styles.container}>
            <SectionTitle
              title="Excursii Recomandate"
              subtitle="Cele mai populare destinații ale noastre — selectate cu grijă pentru confort, valoare și experiențe memorabile."
              centered
            />
            <div className={styles.tripsGrid}>
              {featuredTrips.map((trip, i) => {
                const rubric = rubrics.find((r) => r.id === trip.rubricId);
                return (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    rubricName={rubric?.name}
                    index={i}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className={styles.aboutSection} id="despre-noi">
          <div className={styles.container}>
            <div className={styles.aboutGrid}>
              <AnimatedSection className={styles.aboutContent}>
                <div className={styles.aboutLine} />
                <h2 className={styles.aboutTitle}>Despre Noi</h2>
                <p className={styles.aboutText}>
                  Fondată în 2010 în inima Brașovului, <strong>Aventură și Călătorii</strong> a crescut
                  de la o mică agenție locală la una dintre cele mai apreciate companii de turism din
                  județul Brașov, specializată în excursii cu autocarul.
                </p>
                <p className={styles.aboutText}>
                  Cu o flotă modernă de autocare dotate cu aer condiționat, WiFi și confort premium,
                  organizăm excursii educative pentru elevi, tururi relaxante pentru seniori și
                  servicii de transport pentru grupuri la evenimente speciale.
                </p>
                <p className={styles.aboutText}>
                  Echipa noastră de ghizi specializați și șoferi profesioniști asigură siguranța și
                  satisfacția fiecărui pasager. România e fascinantă — și noi suntem aici să o
                  descoperim împreună cu dumneavoastră.
                </p>
                <div className={styles.aboutCerts}>
                  <div className={styles.cert}>
                    <span className={styles.certIcon}>✓</span>
                    Licențiați ANPC
                  </div>
                  <div className={styles.cert}>
                    <span className={styles.certIcon}>✓</span>
                    Asigurați RCA &amp; Călători
                  </div>
                  <div className={styles.cert}>
                    <span className={styles.certIcon}>✓</span>
                    Ghizi Autorizați
                  </div>
                </div>
              </AnimatedSection>

              <HomeClient />
            </div>
          </div>
        </section>

        {/* Why Us Section */}
        <section className={styles.whySection}>
          <div className={styles.container}>
            <SectionTitle
              title="De Ce Să Ne Alegeți?"
              subtitle="Patru motive solide pentru care clienții noștri revin an de an."
              centered
              light
            />
            <div className={styles.whyGrid}>
              {[
                {
                  icon: '🏆',
                  title: 'Experiență',
                  desc: '15 ani de excursii organizate cu succes. Cunoaștem România de la munte la mare și știm cum să creăm experiențe memorabile.',
                },
                {
                  icon: '🛋️',
                  title: 'Confort',
                  desc: 'Autocare moderne cu aer condiționat, scaune ergonomice, WiFi și dotări premium pentru un drum plăcut indiferent de distanță.',
                },
                {
                  icon: '💰',
                  title: 'Prețuri Accesibile',
                  desc: 'Raport calitate-preț excelent. Transparență totală — fără costuri ascunse. Oferte speciale pentru grupuri mari și rezervări anticipate.',
                },
                {
                  icon: '🛡️',
                  title: 'Siguranță',
                  desc: 'Șoferi profesioniști licențiați, vehicule verificate tehnic, asigurare completă pentru pasageri și bagaje pe orice rută.',
                },
              ].map((item, i) => (
                <AnimatedSection key={i} delay={i * 0.12} className={styles.whyCard}>
                  <div className={styles.whyIcon}>{item.icon}</div>
                  <h3 className={styles.whyTitle}>{item.title}</h3>
                  <p className={styles.whyDesc}>{item.desc}</p>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className={styles.testimonialsSection}>
          <div className={styles.container}>
            <SectionTitle
              title="Ce Spun Clienții Noștri"
              subtitle="Mii de clienți mulțumiți ne recomandă. Iată câteva din experiențele lor."
              centered
              light
            />
            <div className={styles.testimonialsGrid}>
              {[
                {
                  name: 'Maria Ionescu',
                  role: 'Profesor, Brașov',
                  text: 'Am organizat excursia de sfârșit de an cu clasa prin Aventură și Călătorii și a fost o experiență extraordinară! Ghidul a fost minunat cu elevii, autocarul modern și confortabil, iar prețul foarte accesibil. Recomand cu căldură!',
                  rating: 5,
                  avatar: 'MI',
                },
                {
                  name: 'Gheorghe Popescu',
                  role: 'Pensionar, Cluj-Napoca',
                  text: 'Al treilea an consecutiv merg cu grupul de seniori la excursii organizate de această firmă. Totul este perfect organizat, ghizii sunt răbdători și profesioniști, iar locațiile alese sunt superbe. Ne simțim în siguranță și bine îngrijiți.',
                  rating: 5,
                  avatar: 'GP',
                },
                {
                  name: 'Ana & Mihai Dumitrescu',
                  role: 'Clienți fideli',
                  text: 'Am închiriat autocarul pentru nunta noastră — transport pentru 45 de invitați din Brașov la Sinaia. Totul a decurs impecabil: punctualitate, curățenie, șofer elegant și profesionist. Mulțumim din suflet!',
                  rating: 5,
                  avatar: 'AD',
                },
              ].map((t, i) => (
                <AnimatedSection key={i} delay={i * 0.15} className={styles.testimonialCard}>
                  <div className={styles.testimonialStars}>
                    {'★'.repeat(t.rating)}
                  </div>
                  <p className={styles.testimonialText}>"{t.text}"</p>
                  <div className={styles.testimonialAuthor}>
                    <div className={styles.testimonialAvatar}>{t.avatar}</div>
                    <div>
                      <p className={styles.testimonialName}>{t.name}</p>
                      <p className={styles.testimonialRole}>{t.role}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className={styles.contactSection} id="contact">
          <div className={styles.container}>
            <div className={styles.contactGrid}>
              <AnimatedSection className={styles.contactInfo}>
                <div className={styles.aboutLine} />
                <h2 className={styles.contactTitle}>Contactează-ne</h2>
                <p className={styles.contactSubtitle}>
                  Ai întrebări sau vrei să rezervi o excursie? Suntem disponibili să te ajutăm!
                </p>
                <div className={styles.contactDetails}>
                  <div className={styles.contactDetail}>
                    <span className={styles.contactDetailIcon}>📍</span>
                    <div>
                      <strong>Adresă</strong>
                      <p>{contact.address}</p>
                    </div>
                  </div>
                  <div className={styles.contactDetail}>
                    <span className={styles.contactDetailIcon}>📞</span>
                    <div>
                      <strong>Telefon</strong>
                      <p><a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a></p>
                    </div>
                  </div>
                  <div className={styles.contactDetail}>
                    <span className={styles.contactDetailIcon}>✉️</span>
                    <div>
                      <strong>Email</strong>
                      <p><a href={`mailto:${contact.email}`}>{contact.email}</a></p>
                    </div>
                  </div>
                  <div className={styles.contactDetail}>
                    <span className={styles.contactDetailIcon}>🕐</span>
                    <div>
                      <strong>Program</strong>
                      <p>{contact.scheduleWeekdays}</p>
                      <p>{contact.scheduleSaturday}</p>
                    </div>
                  </div>
                </div>
                <div className={styles.mapPlaceholder}>
                  <span>📍 Brașov, România</span>
                  <p>Hartă interactivă disponibilă în curând</p>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2} className={styles.contactFormWrapper}>
                <div className={styles.contactForm}>
                  <h3 className={styles.formTitle}>Trimite-ne un Mesaj</h3>
                  <ContactForm />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
      </main>
      <Footer contact={contact} />
    </>
  );
}
