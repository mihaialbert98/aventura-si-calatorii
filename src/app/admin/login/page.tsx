'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { Eye, EyeOff, Lock } from 'lucide-react';
import styles from './AdminLogin.module.scss';

interface LoginForm {
  password: string;
}

export default function AdminLoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: data.password }),
      });
      if (res.ok) {
        window.location.href = '/admin';
      } else {
        const json = await res.json();
        setError(json.error || 'Parolă incorectă. Încearcă din nou.');
      }
    } catch {
      setError('Eroare de conexiune. Încearcă din nou.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logoMark}>
            <Image src="/images/logo.png" alt="Aventură și Călătorii" width={56} height={46} />
          </div>
          <h1 className={styles.title}>Panou Administrare</h1>
          <p className={styles.subtitle}>Aventură și Călătorii — acces securizat</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <Lock size={14} />
              Parolă de acces
            </label>
            <div className={styles.inputWrapper}>
              <input
                type={showPw ? 'text' : 'password'}
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                placeholder="Introduceți parola"
                {...register('password', { required: 'Parola este obligatorie' })}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPw(!showPw)}
                tabIndex={-1}
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span className={styles.fieldError}>{errors.password.message}</span>
            )}
          </div>

          {error && (
            <div className={styles.errorBanner}>
              <span>⚠</span>
              {error}
            </div>
          )}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? (
              <>
                <span className={styles.spinner} />
                Se verifică...
              </>
            ) : (
              'Intră în panou'
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <p>Acces restricționat — doar personal autorizat</p>
        </div>
      </div>
    </div>
  );
}
