'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Send, CheckCircle } from 'lucide-react';
import styles from './HomePage.module.scss';

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    // Simulate sending
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
    reset();
  };

  if (submitted) {
    return (
      <div className={styles.formSuccess}>
        <CheckCircle size={48} className={styles.successIcon} />
        <h4>Mesaj trimis cu succes!</h4>
        <p>Vă vom contacta în cel mai scurt timp posibil. Mulțumim!</p>
        <button onClick={() => setSubmitted(false)} className={styles.formBtn}>
          Trimite alt mesaj
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Nume complet *</label>
          <input
            type="text"
            className={`${styles.formInput} ${errors.name ? styles.inputError : ''}`}
            placeholder="Ioan Popescu"
            {...register('name', { required: 'Numele este obligatoriu' })}
          />
          {errors.name && <span className={styles.errorMsg}>{errors.name.message}</span>}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Telefon</label>
          <input
            type="tel"
            className={styles.formInput}
            placeholder="+40 7XX XXX XXX"
            {...register('phone')}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Email *</label>
        <input
          type="email"
          className={`${styles.formInput} ${errors.email ? styles.inputError : ''}`}
          placeholder="email@exemplu.ro"
          {...register('email', {
            required: 'Email-ul este obligatoriu',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Email invalid' },
          })}
        />
        {errors.email && <span className={styles.errorMsg}>{errors.email.message}</span>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Mesaj *</label>
        <textarea
          className={`${styles.formTextarea} ${errors.message ? styles.inputError : ''}`}
          placeholder="Descrieți excursia dorită, numărul de persoane, data preferată..."
          rows={5}
          {...register('message', {
            required: 'Mesajul este obligatoriu',
            minLength: { value: 20, message: 'Mesajul trebuie să aibă cel puțin 20 de caractere' },
          })}
        />
        {errors.message && <span className={styles.errorMsg}>{errors.message.message}</span>}
      </div>

      <button type="submit" className={styles.formBtn} disabled={loading}>
        {loading ? (
          <>
            <span className={styles.spinner} />
            Se trimite...
          </>
        ) : (
          <>
            <Send size={17} />
            Trimite Mesajul
          </>
        )}
      </button>
    </form>
  );
}
