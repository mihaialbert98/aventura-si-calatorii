'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, Star, ArrowRight } from 'lucide-react';
import { Trip } from '@/types';
import styles from './TripCard.module.scss';

interface TripCardProps {
  trip: Trip;
  variant?: 'horizontal' | 'vertical';
  rubricName?: string;
  index?: number;
}

export default function TripCard({ trip, variant = 'vertical', rubricName, index = 0 }: TripCardProps) {
  return (
    <motion.div
      className={`${styles.card} ${variant === 'horizontal' ? styles.horizontal : styles.vertical}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
    >
      <Link href={`/trips/${trip.slug}`} className={styles.cardLink}>
        {/* Image */}
        <div className={styles.imageWrapper}>
          <Image
            src={trip.images[0]}
            alt={trip.title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className={styles.image}
          />
          <div className={styles.imageOverlay} />

          {/* Badges */}
          <div className={styles.badges}>
            {trip.featured && (
              <span className={styles.featuredBadge}>
                <Star size={11} fill="currentColor" />
                Recomandat
              </span>
            )}
            {rubricName && (
              <span className={styles.rubricBadge}>{rubricName}</span>
            )}
          </div>

          {/* Price overlay */}
          <div className={styles.priceTag}>
            <span className={styles.priceFrom}>de la</span>
            <span className={styles.priceValue}>{trip.price} lei</span>
            <span className={styles.pricePer}>/pers.</span>
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <h3 className={styles.title}>{trip.title}</h3>
          <p className={styles.description}>{trip.shortDescription}</p>

          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <MapPin size={14} />
              <span>{trip.destination}</span>
            </div>
            <div className={styles.metaItem}>
              <Clock size={14} />
              <span>{trip.duration}</span>
            </div>
            <div className={styles.metaItem}>
              <Users size={14} />
              <span>{trip.groupSize}</span>
            </div>
          </div>

          <div className={styles.footer}>
            <div className={styles.difficultyBadge} data-difficulty={trip.difficulty}>
              {trip.difficulty}
            </div>
            <div className={styles.cta}>
              <span>Detalii</span>
              <span className={styles.ctaArrow}><ArrowRight size={15} /></span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
