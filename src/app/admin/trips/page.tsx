import Link from 'next/link';
import { getTrips, getRubrics } from '@/lib/data';
import { Plus, Star, Pencil, ExternalLink } from 'lucide-react';
import DeleteTripButton from './DeleteTripButton';
import styles from './AdminTrips.module.scss';

export default function AdminTripsPage() {
  const trips = getTrips();
  const rubrics = getRubrics();

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Excursii</h1>
          <p className={styles.pageSubtitle}>
            {trips.length} excursii în total
          </p>
        </div>
        <Link href="/admin/trips/new" className={styles.addBtn}>
          <Plus size={18} />
          Adaugă excursie
        </Link>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Titlu</th>
                <th>Rubrică</th>
                <th>Preț</th>
                <th>Durată</th>
                <th>Destinație</th>
                <th>Recomandat</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => {
                const rubric = rubrics.find((r) => r.id === trip.rubricId);
                return (
                  <tr key={trip.id}>
                    <td>
                      <div className={styles.tripCell}>
                        <span className={styles.tripTitle}>{trip.title}</span>
                        <span className={styles.tripSlug}>/{trip.slug}</span>
                      </div>
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
                    <td className={styles.destCell}>{trip.destination}</td>
                    <td>
                      {trip.featured ? (
                        <span className={styles.featuredYes}>
                          <Star size={11} fill="currentColor" />
                          Da
                        </span>
                      ) : (
                        <span className={styles.featuredNo}>Nu</span>
                      )}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <Link
                          href={`/admin/trips/${trip.id}/edit`}
                          className={styles.iconBtn}
                          title="Editează"
                        >
                          <Pencil size={15} />
                        </Link>
                        <Link
                          href={`/trips/${trip.slug}`}
                          className={styles.iconBtnView}
                          target="_blank"
                          title="Vizualizează"
                        >
                          <ExternalLink size={15} />
                        </Link>
                        <DeleteTripButton tripId={trip.id} tripTitle={trip.title} />
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

