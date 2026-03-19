'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { getRubrics } from '@/lib/data';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import styles from './AdminTripForm.module.scss';
import { Rubric } from '@/types';

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

export default function NewTripPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rubrics] = useState<Rubric[]>(() => {
    try {
      return [];
    } catch {
      return [];
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TripFormData>({
    defaultValues: {
      departureFrom: 'Brașov',
      difficulty: 'Ușor',
      featured: false,
    },
  });

  const onSubmit = async (data: TripFormData) => {
    setLoading(true);
    setError('');

    const images = data.imagesRaw
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const includes = data.includesRaw
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const excludes = data.excludesRaw
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          price: Number(data.price),
          images,
          includes,
          excludes,
          itinerary: [],
        }),
      });

      if (res.ok) {
        router.push('/admin/trips');
        router.refresh();
      } else {
        const json = await res.json();
        setError(json.error || 'A apărut o eroare. Încearcă din nou.');
      }
    } catch {
      setError('Eroare de rețea. Verifică conexiunea.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <Link href="/admin/trips" className={styles.backBtn}>
          <ArrowLeft size={16} />
          Înapoi la excursii
        </Link>
        <h1 className={styles.pageTitle}>Adaugă excursie nouă</h1>
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
                placeholder="Ex: Castelul Bran și Râșnov"
                {...register('title', { required: 'Titlul este obligatoriu' })}
              />
              {errors.title && <span className={styles.fieldError}>{errors.title.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Descriere scurtă *</label>
              <textarea
                className={`${styles.textarea} ${errors.shortDescription ? styles.inputError : ''}`}
                placeholder="Descriere succintă pentru card (max 150 caractere)"
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
                placeholder="Descriere detaliată a excursiei..."
                rows={5}
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
                {errors.rubricId && (
                  <span className={styles.fieldError}>{errors.rubricId.message}</span>
                )}
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
                  placeholder="ex: 150"
                  {...register('price', {
                    required: 'Prețul este obligatoriu',
                    min: { value: 1, message: 'Prețul trebuie să fie pozitiv' },
                  })}
                />
                {errors.price && <span className={styles.fieldError}>{errors.price.message}</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Durată *</label>
                <input
                  className={`${styles.input} ${errors.duration ? styles.inputError : ''}`}
                  placeholder="ex: 3 zile / 2 nopți"
                  {...register('duration', { required: 'Durata este obligatorie' })}
                />
                {errors.duration && (
                  <span className={styles.fieldError}>{errors.duration.message}</span>
                )}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Destinație *</label>
                <input
                  className={`${styles.input} ${errors.destination ? styles.inputError : ''}`}
                  placeholder="ex: Bran & Râșnov, Brașov"
                  {...register('destination', { required: 'Destinația este obligatorie' })}
                />
                {errors.destination && (
                  <span className={styles.fieldError}>{errors.destination.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Plecare din</label>
                <input
                  className={styles.input}
                  {...register('departureFrom')}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Dimensiune grup</label>
                <input
                  className={styles.input}
                  placeholder="ex: 20-50 elevi"
                  {...register('groupSize')}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Următoarea plecare</label>
                <input
                  type="date"
                  className={styles.input}
                  {...register('nextDeparture')}
                />
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
              <textarea
                className={styles.textarea}
                placeholder="https://images.unsplash.com/photo-xxx&#10;https://images.unsplash.com/photo-yyy"
                rows={4}
                {...register('imagesRaw')}
              />
              <p className={styles.hint}>Prima imagine va fi imaginea principală.</p>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Ce include (câte un element pe linie)</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Transport autocar&#10;Ghid specializat&#10;Bilete intrare"
                  rows={5}
                  {...register('includesRaw')}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Ce nu include (câte un element pe linie)</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Masă&#10;Cheltuieli personale"
                  rows={5}
                  {...register('excludesRaw')}
                />
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
                <Plus size={18} />
                Adaugă excursie
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
