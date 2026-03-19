'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  Map,
  Tag,
  Phone,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import styles from './AdminLayout.module.scss';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/trips', label: 'Excursii', icon: Map },
  { href: '/admin/rubrics', label: 'Rubrici', icon: Tag },
  { href: '/admin/contact', label: 'Contact', icon: Phone },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  return (
    <div className={styles.shell}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.sidebarLogo}>
            <Image src="/images/logo.png" alt="Aventură și Călătorii" width={32} height={26} className={styles.sidebarLogoImg} />
            <div>
              <span className={styles.sidebarLogoMain}>Aventură &amp; Călătorii</span>
              <span className={styles.sidebarLogoSub}>Panou Admin</span>
            </div>
          </Link>
        </div>

        <nav className={styles.sidebarNav}>
          <p className={styles.navSection}>Meniu principal</p>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive(item.href, item.exact) ? styles.navActive : ''}`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {isActive(item.href, item.exact) && <ChevronRight size={14} className={styles.navChevron} />}
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.viewSiteBtn}>
            Vizualizează site-ul
          </Link>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={16} />
            Deconectare
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={styles.main}>
        <div className={styles.mainInner}>
          {children}
        </div>
      </main>
    </div>
  );
}
