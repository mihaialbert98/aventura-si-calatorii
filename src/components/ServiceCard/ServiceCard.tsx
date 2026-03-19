'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, Heart, Bus } from 'lucide-react';
import { Rubric } from '@/types';
import styles from './ServiceCard.module.scss';

const iconMap: Record<string, React.ElementType> = {
  GraduationCap,
  Heart,
  Bus,
};

interface ServiceCardProps {
  rubric: Rubric;
  index: number;
}

export default function ServiceCard({ rubric, index }: ServiceCardProps) {
  const Icon = iconMap[rubric.icon] || Bus;

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
      whileHover={{ y: -8 }}
    >
      <Link href={`/${rubric.slug}`} className={styles.cardLink}>
        {/* Background Image */}
        <div className={styles.imageWrapper}>
          <Image
            src={rubric.image}
            alt={rubric.name}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className={styles.image}
          />
          <div className={styles.overlay} />
        </div>

        {/* Content */}
        <div className={styles.content}>
          <div
            className={styles.iconBadge}
            style={{ background: `${rubric.color}22`, borderColor: `${rubric.color}44` }}
          >
            <Icon size={26} style={{ color: rubric.color }} />
          </div>

          <h3 className={styles.title}>{rubric.name}</h3>
          <p className={styles.description}>{rubric.description}</p>

          <div className={styles.action}>
            <span className={styles.actionLine} />
            <span className={styles.actionText}>Descoperă</span>
            <span className={styles.actionArrow}>
              <ArrowRight size={16} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
