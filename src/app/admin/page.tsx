import Link from 'next/link';
import { getTrips, getRubrics } from '@/lib/data';
import { Map, Tag, Star, Plus, ArrowRight, TrendingUp } from 'lucide-react';
import styles from './AdminDashboard.module.scss';

export default function AdminDashboard() {
  const trips = getTrips();
  const rubrics = getRubrics();
  const featured = trips.filter((t) => t.featured);
  const recentTrips = [...trips].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  const stats = [
    {
      label: 'Total Excursii',
      value: trips.length,
      icon: Map,
      color: '#0f2b46',
      bgColor: 'rgba(15,43,70,0.08)',
    },
    {
      label: 'Rubrici',
      value: rubrics.length,
      icon: Tag,
      color: '#e8923a',
      bgColor: 'rgba(232,146,58,0.1)',
    },
    {
      label: 'Excursii Recomandate',
      value: featured.length,
      icon: Star,
      color: '#1a9e6e',
      bgColor: 'rgba(26,158,110,0.1)',
    },
    {
      label: 'Total Destinații',
      value: new Set(trips.map((t) => t.destination)).size,
      icon: TrendingUp,
      color: '#7c3aed',
      bgColor: 'rgba(124,58,237,0.1)',
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>Bun venit! Iată o privire de ansamblu.</p>
        </div>
        <Link href="/admin/trips/new" className={styles.addBtn}>
          <Plus size={18} />
          Adaugă excursie
        </Link>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: stat.bgColor }}>
              <stat.icon size={22} style={{ color: stat.color }} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>Acțiuni rapide</h2>
        <div className={styles.actionsGrid}>
          <Link href="/admin/trips/new" className={styles.actionCard}>
            <Map size={20} />
            <span>Adaugă excursie nouă</span>
            <ArrowRight size={16} className={styles.actionArrow} />
          </Link>
          <Link href="/admin/rubrics" className={styles.actionCard}>
            <Tag size={20} />
            <span>Gestionează rubrici</span>
            <ArrowRight size={16} className={styles.actionArrow} />
          </Link>
          <Link href="/admin/trips" className={styles.actionCard}>
            <Map size={20} />
            <span>Toate excursiile</span>
            <ArrowRight size={16} className={styles.actionArrow} />
          </Link>
        </div>
      </div>

      {/* Recent Trips Table */}
      <div className={styles.tableSection}>
        <div className={styles.tableSectionHeader}>
          <h2 className={styles.sectionTitle}>Excursii recente</h2>
          <Link href="/admin/trips" className={styles.viewAll}>
            Toate excursiile <ArrowRight size={14} />
          </Link>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Titlu</th>
                <th>Rubrică</th>
                <th>Preț</th>
                <th>Durată</th>
                <th>Recomandat</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {recentTrips.map((trip) => {
                const rubric = rubrics.find((r) => r.id === trip.rubricId);
                return (
                  <tr key={trip.id}>
                    <td className={styles.tripName}>
                      <span>{trip.title}</span>
                      <span className={styles.tripDest}>{trip.destination}</span>
                    </td>
                    <td>
                      {rubric && (
                        <span
                          className={styles.rubricChip}
                          style={{ background: `${rubric.color}18`, color: rubric.color }}
                        >
                          {rubric.name}
                        </span>
                      )}
                    </td>
                    <td className={styles.priceCell}>{trip.price} lei</td>
                    <td>{trip.duration}</td>
                    <td>
                      {trip.featured ? (
                        <span className={styles.featuredYes}>
                          <Star size={12} fill="currentColor" />
                          Da
                        </span>
                      ) : (
                        <span className={styles.featuredNo}>Nu</span>
                      )}
                    </td>
                    <td>
                      <div className={styles.rowActions}>
                        <Link href={`/admin/trips/${trip.id}/edit`} className={styles.editBtn}>
                          Editează
                        </Link>
                        <Link href={`/trips/${trip.slug}`} className={styles.viewBtn} target="_blank">
                          Vizualizează
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
