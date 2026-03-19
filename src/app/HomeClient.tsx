'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './HomePage.module.scss';

const stats = [
  { value: 15, suffix: ' ani', label: 'de experiență' },
  { value: 500, suffix: '+', label: 'excursii organizate' },
  { value: 10000, suffix: '+', label: 'clienți mulțumiți' },
  { value: 98, suffix: '%', label: 'rată de satisfacție' },
];

function CounterStat({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className={styles.statCard}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay }}
    >
      <motion.span
        className={styles.statNumber}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: delay + 0.2 }}
      >
        {value.toLocaleString('ro-RO')}{suffix}
      </motion.span>
      <span className={styles.statDesc}>{label}</span>
    </motion.div>
  );
}

export default function HomeClient() {
  return (
    <div className={styles.aboutStats}>
      <div className={styles.statsGrid}>
        {stats.map((s, i) => (
          <CounterStat
            key={i}
            value={s.value}
            suffix={s.suffix}
            label={s.label}
            delay={i * 0.12}
          />
        ))}
      </div>
      <div className={styles.aboutImage}>
        <div
          className={styles.aboutImageInner}
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1530099486328-e021101a494a?w=800&q=80')",
          }}
        />
        <div className={styles.aboutImageBadge}>
          <span className={styles.badgeNumber}>2010</span>
          <span className={styles.badgeText}>Fondată în Brașov</span>
        </div>
      </div>
    </div>
  );
}
