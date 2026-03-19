'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { Trip } from '@/types';
import styles from '../../new/AdminTripForm.module.scss';

interface TripFormData {
  title: string;
  description: string;
  shortDescription: string;
  rubricId: string;
  price: number;
  duration: string;
  groupSize: string;
  destination: string;
  departureFrom: string;
  difficulty: 'Ușor' | 'Moderat' | 'Dificil';
  nextDeparture: string;
  featured: boolean;
  imagesRaw: string;
  includesRaw: string;
  excludesRaw: string;
}

interface PageProps {
  params: { id: string };
}

export default function EditTripPage({ params }: PageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [trip, setTrip] = useState<Trip | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TripFormData>();

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await fetch(`/api/trips/${params.id}`);
        if (res.ok) {
          const data: Trip = await res.json();
          setTrip(data);
          reset({
            title: data.title,
            description: data.description,
            shortDescription: data.shortDescription,
            rubricId: data.rubricId,
            price: data.price,
            duration: data.duration,
            groupSize: data.groupSize,
            destination: data.destination,
            departureFrom: data.departureFrom,
            difficulty: data.difficulty,
            nextDeparture: data.nextDeparture.split('T')[0],
            featured: data.featured,
            imagesRaw: data.images.join('\n'),
            includesRaw: data.includes.join('\n'),
            excludesRaw: data.excludes.join('\n'),
          });
        } else {
          setError('Excursia nu a fost găsită.');
        }
      } catch {
        setError('Eroare la încărcarea datelor.');
      } finally {
        setFetchLoading(false);
      }
    };
    fetchTrip();
  }, [params.id, reset]);

  const onSubmit = async (data: TripFormData) => {
    setLoading(true);
    setError('');

    const images = data.imagesRaw.split('\n').map((s) => s.trim()).filter(Boolean);
    const includes = data.includesRaw.split('\n').map((s) => s.trim()).filter(Boolean);
    const excludes = data.excludesRaw.split('\n').map((s) => s.trim()).filter(Boolean);

    try {
      const res = await fetch(`/api/trips/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          price: Number(data.price),
          images,
          includes,
          excludes,
        }),
      });

      if (res.ok) {
        router.push('/admin/trips');
        router.refresh();
      } else {
        const json = await res.json();
        setError(json.error || 'Eroare la salvare.');
      }
    } catch {
      setError('Eroare de rețea.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className={styles.page}>
        <div style={{ textAlign: 'center', padding: '60px', color: '#5a6a7a' }}>
          Se încarcă...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <Link href="/admin/trips" className={styles.backBtn}>
          <ArrowLeft size={16} />
          Înapoi la excursii
        </Link>
        <h1 className={styles.pageTitle}>
          Editează: {trip?.title || 'Excursie'}
        </h1>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <span>⚠</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
        <div className={styles.formGrid}>
          {/* Basic Info */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Informații de bază</h2>

            <div className={styles.formGroup}>
              <label className={styles.label}>Titlu excursie *</label>
              <input
                className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
                {...register('title', { required: 'Titlul este obligatoriu' })}
              />
              {errors.title && <span className={styles.fieldError}>{errors.title.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Descriere scurtă *</label>
              <textarea
                className={`${styles.textarea} ${errors.shortDescription ? styles.inputError : ''}`}
                rows={2}
                {...register('shortDescription', { required: 'Descrierea scurtă este obligatorie' })}
              />
              {errors.shortDescription && (
                <span className={styles.fieldError}>{errors.shortDescription.message}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Descriere completă *</label>
              <textarea
                className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
                rows={6}
                {...register('description', { required: 'Descrierea este obligatorie' })}
              />
              {errors.description && (
                <span className={styles.fieldError}>{errors.description.message}</span>
              )}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Rubrică *</label>
                <select
                  className={`${styles.select} ${errors.rubricId ? styles.inputError : ''}`}
                  {...register('rubricId', { required: 'Rubrica este obligatorie' })}
                >
                  <option value="">Selectează rubrica</option>
                  <option value="1">Excursii Școlare</option>
                  <option value="2">Excursii Seniori</option>
                  <option value="3">Închiriere Autocare</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Dificultate</label>
                <select className={styles.select} {...register('difficulty')}>
                  <option value="Ușor">Ușor</option>
                  <option value="Moderat">Moderat</option>
                  <option value="Dificil">Dificil</option>
                </select>
              </div>
            </div>
          </div>

          {/* Logistics */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Logistică și prețuri</h2>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Preț (lei/persoană) *</label>
                <input
                  type="number"
                  min="1"
                  className={`${styles.input} ${errors.price ? styles.inputError : ''}`}
                  {...register('price', { required: 'Prețul este obligatoriu', min: 1 })}
                />
                {errors.price && <span className={styles.fieldError}>{errors.price.message}</span>}
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Durată *</label>
                <input
                  className={`${styles.input} ${errors.duration ? styles.inputError : ''}`}
                  {...register('duration', { required: 'Durata este obligatorie' })}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Destinație *</label>
                <input
                  className={`${styles.input} ${errors.destination ? styles.inputError : ''}`}
                  {...register('destination', { required: 'Destinația este obligatorie' })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Plecare din</label>
                <input className={styles.input} {...register('departureFrom')} />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Dimensiune grup</label>
                <input className={styles.input} {...register('groupSize')} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Următoarea plecare</label>
                <input type="date" className={styles.input} {...register('nextDeparture')} />
              </div>
            </div>

            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" className={styles.checkbox} {...register('featured')} />
                <span>Excursie recomandată (featured)</span>
              </label>
            </div>
          </div>

          {/* Images & Lists */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Imagini și detalii</h2>

            <div className={styles.formGroup}>
              <label className={styles.label}>URL-uri imagini (câte unul pe linie)</label>
              <textarea className={styles.textarea} rows={4} {...register('imagesRaw')} />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Ce include (câte un element pe linie)</label>
                <textarea className={styles.textarea} rows={5} {...register('includesRaw')} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Ce nu include (câte un element pe linie)</label>
                <textarea className={styles.textarea} rows={5} {...register('excludesRaw')} />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formFooter}>
          <Link href="/admin/trips" className={styles.cancelBtn}>
            Anulează
          </Link>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? (
              <>
                <span className={styles.spinner} />
                Se salvează...
              </>
            ) : (
              <>
                <Save size={17} />
                Salvează modificările
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
