'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Save, Plus, Trash2, Phone, Mail, MapPin, Facebook, Instagram, Clock } from 'lucide-react';
import { ContactInfo } from '@/types';
import styles from './AdminContact.module.scss';

interface ContactFormData {
  phone: string;
  phones: { value: string }[];
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  scheduleWeekdays: string;
  scheduleSaturday: string;
}

export default function AdminContactPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'phones',
  });

  useEffect(() => {
    fetch('/api/contact')
      .then((res) => res.json())
      .then((data: ContactInfo) => {
        reset({
          phone: data.phone,
          phones: data.phones.map((p) => ({ value: p })),
          email: data.email,
          address: data.address,
          facebook: data.facebook,
          instagram: data.instagram,
          scheduleWeekdays: data.scheduleWeekdays,
          scheduleSaturday: data.scheduleSaturday,
        });
        setLoading(false);
      })
      .catch(() => {
        setError('Nu s-au putut încărca datele de contact.');
        setLoading(false);
      });
  }, [reset]);

  const onSubmit = async (data: ContactFormData) => {
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const payload: ContactInfo = {
        phone: data.phone,
        phones: data.phones.map((p) => p.value).filter(Boolean),
        email: data.email,
        address: data.address,
        facebook: data.facebook,
        instagram: data.instagram,
        scheduleWeekdays: data.scheduleWeekdays,
        scheduleSaturday: data.scheduleSaturday,
      };

      const res = await fetch('/api/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Eroare la salvare. Încearcă din nou.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.loadingText}>Se încarcă...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Informații de Contact</h1>
        <p className={styles.pageSubtitle}>
          Modifică datele de contact afișate pe site — telefoane, email, adresă, rețele sociale și program.
        </p>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <span>⚠</span>
          {error}
        </div>
      )}

      {success && (
        <div className={styles.successBanner}>
          <span>✓</span>
          Datele de contact au fost actualizate cu succes!
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* Phone Numbers */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <Phone size={16} />
            Telefoane
          </h2>

          <div className={styles.formGroup}>
            <label className={styles.label}>Telefon Principal *</label>
            <input
              className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
              placeholder="+40 xxx xxx xxx"
              {...register('phone', { required: 'Telefonul principal este obligatoriu' })}
            />
            {errors.phone && <span className={styles.fieldError}>{errors.phone.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Telefoane Secundare</label>
            <div className={styles.dynamicList}>
              {fields.map((field, index) => (
                <div key={field.id} className={styles.dynamicRow}>
                  <input
                    className={styles.input}
                    placeholder="+40 xxx xxx xxx"
                    {...register(`phones.${index}.value`)}
                  />
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => remove(index)}
                    title="Șterge"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className={styles.addBtn}
                onClick={() => append({ value: '' })}
              >
                <Plus size={14} />
                Adaugă telefon
              </button>
            </div>
          </div>
        </div>

        {/* Email & Address */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <Mail size={16} />
            Email și Adresă
          </h2>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email *</label>
              <input
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                placeholder="office@exemplu.ro"
                {...register('email', { required: 'Emailul este obligatoriu' })}
              />
              {errors.email && <span className={styles.fieldError}>{errors.email.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Adresă</label>
              <input
                className={styles.input}
                placeholder="Strada, Nr, Oraș, Cod Poștal"
                {...register('address')}
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <Facebook size={16} />
            Rețele Sociale
          </h2>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Facebook size={13} />
                Link Facebook
              </label>
              <input
                className={styles.input}
                placeholder="https://facebook.com/pagina-ta"
                {...register('facebook')}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Instagram size={13} />
                Link Instagram
              </label>
              <input
                className={styles.input}
                placeholder="https://instagram.com/contul-tau"
                {...register('instagram')}
              />
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <Clock size={16} />
            Program
          </h2>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Program Luni – Vineri</label>
              <input
                className={styles.input}
                placeholder="Luni – Vineri: 09:00 – 18:00"
                {...register('scheduleWeekdays')}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Program Sâmbătă</label>
              <input
                className={styles.input}
                placeholder="Sâmbătă: 10:00 – 14:00"
                {...register('scheduleSaturday')}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className={styles.formFooter}>
          <button type="submit" className={styles.submitBtn} disabled={saving}>
            {saving ? (
              <>
                <span className={styles.spinner} />
                Se salvează...
              </>
            ) : (
              <>
                <Save size={16} />
                Salvează Modificările
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
