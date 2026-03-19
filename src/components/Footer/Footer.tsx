import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Facebook, Instagram, ArrowRight } from 'lucide-react';
import { ContactInfo } from '@/types';
import styles from './Footer.module.scss';

interface FooterProps {
  contact?: ContactInfo;
}

const quickLinks = [
  { href: '/', label: 'Acasă' },
  { href: '/excursii-scolare', label: 'Excursii Școlare' },
  { href: '/excursii-seniori', label: 'Excursii Seniori' },
  { href: '/inchiriere-autocare', label: 'Închiriere Autocare' },
  { href: '/#despre-noi', label: 'Despre Noi' },
  { href: '/#contact', label: 'Contact' },
];

const services = [
  { href: '/excursii-scolare', label: 'Excursii pentru Elevi' },
  { href: '/excursii-seniori', label: 'Tururi pentru Seniori' },
  { href: '/inchiriere-autocare', label: 'Închiriere Autocar' },
  { href: '/excursii-scolare', label: 'Programe Educaționale' },
  { href: '/excursii-seniori', label: 'Circuite Culturale' },
];

export default function Footer({ contact }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const phone = contact?.phone || '+40 123 456 789';
  const phones = contact?.phones || ['+40 987 654 321'];
  const email = contact?.email || 'office@aventura-calatorii.ro';
  const address = contact?.address || 'Strada Republicii nr. 12, Brașov, 500030';
  const facebookUrl = contact?.facebook || 'https://facebook.com';
  const instagramUrl = contact?.instagram || 'https://instagram.com';
  const scheduleWeekdays = contact?.scheduleWeekdays || 'Luni – Vineri: 09:00 – 18:00';
  const scheduleSaturday = contact?.scheduleSaturday || 'Sâmbătă: 10:00 – 14:00';

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Column 1: Logo + Description */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.logo}>
              <Image
                src="/images/logo.png"
                alt="Aventură și Călătorii"
                width={40}
                height={32}
                className={styles.logoImage}
              />
              <div>
                <span className={styles.logoMain}>Aventură &amp; Călătorii</span>
                <span className={styles.logoSub}>Brașov, România</span>
              </div>
            </Link>
            <p className={styles.description}>
              Companie de turism din Brașov fondată în 2010, specializată în excursii cu autocarul
              pentru elevi, seniori și grupuri. Descoperim împreună frumusețile României cu pasiune
              și profesionalism.
            </p>
            <div className={styles.socials}>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Navigare</h4>
            <ul className={styles.linkList}>
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.footerLink}>
                    <ArrowRight size={14} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Servicii</h4>
            <ul className={styles.linkList}>
              {services.map((service, i) => (
                <li key={i}>
                  <Link href={service.href} className={styles.footerLink}>
                    <ArrowRight size={14} />
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className={styles.contactCol}>
            <h4 className={styles.colTitle}>Contact</h4>
            <div className={styles.contactList}>
              <div className={styles.contactItem}>
                <MapPin size={16} className={styles.contactIcon} />
                <div>
                <p>{address}</p>
                </div>
              </div>
              <div className={styles.contactItem}>
                <Phone size={16} className={styles.contactIcon} />
                <div>
                  <a href={`tel:${phone.replace(/\s/g, '')}`} className={styles.contactLink}>{phone}</a>
                  {phones.map((p, i) => (
                    <a key={i} href={`tel:${p.replace(/\s/g, '')}`} className={styles.contactLink}>{p}</a>
                  ))}
                </div>
              </div>
              <div className={styles.contactItem}>
                <Mail size={16} className={styles.contactIcon} />
                <div>
                  <a href={`mailto:${email}`} className={styles.contactLink}>
                    {email}
                  </a>
                </div>
              </div>
            </div>

            <div className={styles.schedule}>
              <p className={styles.scheduleTitle}>Program</p>
              <p>{scheduleWeekdays}</p>
              <p>{scheduleSaturday}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomContainer}>
          <p className={styles.copyright}>
            &copy; {currentYear} Aventură și Călătorii. Toate drepturile rezervate.
          </p>
          <p className={styles.motto}>
            <Image src="/images/logo.png" alt="" width={18} height={14} className={styles.mottoLogo} />
            România e fascinantă — să o descoperim împreună
          </p>
        </div>
      </div>
    </footer>
  );
}
