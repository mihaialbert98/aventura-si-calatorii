'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, X, Phone } from 'lucide-react';
import styles from './Navbar.module.scss';

interface NavbarProps {
  phone?: string;
}

const navLinks = [
  { href: '/', label: 'Acasă' },
  { href: '/excursii-scolare', label: 'Excursii Școlare' },
  { href: '/excursii-seniori', label: 'Excursii Seniori' },
  { href: '/inchiriere-autocare', label: 'Închiriere Autocare' },
  { href: '/#despre-noi', label: 'Despre Noi' },
  { href: '/#contact', label: 'Contact' },
];

export default function Navbar({ phone = '+40 123 456 789' }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : styles.transparent}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/images/logo.png"
            alt="Aventură și Călătorii"
            width={44}
            height={36}
            className={styles.logoImage}
          />
          <div className={styles.logoText}>
            <span className={styles.logoMain}>Aventură &amp; Călătorii</span>
            <span className={styles.logoSub}>Brașov, România</span>
          </div>
        </Link>

        <nav className={styles.desktopNav}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${isActive(link.href) ? styles.active : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <a href={`tel:${phone.replace(/\s/g, '')}`} className={styles.phoneLink}>
            <Phone size={16} />
            <span>{phone}</span>
          </a>
          <Link href="/#contact" className={styles.ctaBtn}>
            Rezervă Acum
          </Link>
          <button
            className={styles.hamburger}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileOpen : ''}`}>
        <nav className={styles.mobileNav}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.mobileNavLink} ${isActive(link.href) ? styles.active : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/#contact" className={styles.mobileCta} onClick={() => setMobileOpen(false)}>
            Rezervă Acum
          </Link>
        </nav>
      </div>
    </header>
  );
}
