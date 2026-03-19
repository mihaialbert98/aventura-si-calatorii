'use client';

import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import styles from './AdminTrips.module.scss';

interface Props {
  tripId: string;
  tripTitle: string;
}

export default function DeleteTripButton({ tripId, tripTitle }: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Ești sigur că vrei să ștergi "${tripTitle}"?`)) return;
    try {
      await fetch(`/api/trips/${tripId}`, { method: 'DELETE' });
      router.refresh();
    } catch {
      alert('Eroare la ștergere. Încearcă din nou.');
    }
  };

  return (
    <button
      type="button"
      className={styles.iconBtnDelete}
      title="Șterge"
      onClick={handleDelete}
    >
      <Trash2 size={15} />
    </button>
  );
}
