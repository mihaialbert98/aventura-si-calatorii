'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown, Star, Users, Calendar } from 'lucide-react';
import styles from './Hero.module.scss';

const stats = [
  { icon: Calendar, value: '15+', label: 'ani experiență' },
  { icon: Star, value: '500+', label: 'excursii organizate' },
  { icon: Users, value: '10.000+', label: 'clienți mulțumiți' },
];

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* Background Image */}
      <div
        className={styles.background}
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')",
        }}
      />
      <div className={styles.overlay} />
      <div className={styles.grain} />

      {/* Content */}
      <div className={styles.content}>
        <motion.div
          className={styles.badge}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Star size={14} fill="currentColor" />
          <span>Companie de turism din Brașov din 2010</span>
        </motion.div>

        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          România e Fascinantă.
          <br />
          <span className={styles.titleAccent}>Să o Descoperim Împreună</span>
        </motion.h1>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          Excursii cu autocarul din Brașov — pentru elevi, seniori și grupuri.
          <br />
          Confort, siguranță și amintiri de neuitat la fiecare pas.
        </motion.p>

        <motion.div
          className={styles.actions}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Link href="/#servicii" className={styles.btnPrimary}>
            Explorează Excursiile
          </Link>
          <Link href="/#contact" className={styles.btnOutline}>
            Contactează-ne
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className={styles.scrollIndicator}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={22} />
          </motion.div>
        </motion.div>
      </div>

      {/* Stats bar */}
      <motion.div
        className={styles.statsBar}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
      >
        {stats.map((stat, i) => (
          <div key={i} className={styles.statItem}>
            <div className={styles.statIcon}>
              <stat.icon size={22} />
            </div>
            <div className={styles.statText}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
