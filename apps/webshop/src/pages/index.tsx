import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { fetchGraphQL } from '../utils/fetchGraphQL';
import type { Product, ProductCategory } from '../types';
import styles from './index.module.css';


const FEATURED_IDS = ['1', '4', '11', '17'];

const BATCH_QUERY = `
  query GetProducts($ids: [ID!]!) {
    products(ids: $ids) {
      id
      name
      price
      imageUrl
      description
      category
      stock
      createdAt
    }
  }
`;

const CATEGORIES: Array<ProductCategory> = [
  'Tools',
  'Fasteners',
  'Safety Equipment',
  'Power Tools',
];

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const data = await fetchGraphQL<{ products: Array<Product> }>(BATCH_QUERY, {
      ids: FEATURED_IDS,
    });

    return {
      props: {
        featured: data.products ?? [],
        timestamp: Date.now(),
      },
    };
  } catch {
    return {
      props: {
        featured: [],
        timestamp: Date.now(),
      },
    };
  }
};

interface HomePageProps {
  featured: Array<Product>;
  timestamp: number;
}

export default function HomePage({ featured, timestamp }: HomePageProps) {
  const [formattedTime, setFormattedTime] = useState<string>('');

  useEffect(() => {
    setFormattedTime(
      new Date(timestamp).toLocaleTimeString('pl-PL', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    );
  }, [timestamp]);

  return (
    <div>
      <section className={styles.hero}>
        <img
          src="https://placehold.co/1200x800/e63329/ffffff?text=Kramp+Webshop"
          alt="Kramp — Your industrial supply partner"
          loading="eager"
          className={styles.heroImage}
        />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Industrial supplies, delivered.</h1>
          <p className={styles.heroSubtitle}>
            Tools, fasteners, safety equipment and power tools for
            professionals.
          </p>
        </div>
      </section>

      <section className={styles.featured}>
        <div className={styles.featuredHeader}>
          <h2 className={styles.featuredHeading}>Featured products</h2>

          <p className={styles.timestamp}>
            Last updated: {formattedTime || '...'}
          </p>
        </div>

        <div className={styles.grid}>
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className={styles.categories}>
        <h2 className={styles.categoriesHeading}>Shop by category</h2>

        <div className={styles.categoryGrid}>
          {CATEGORIES.map(cat => (
            <Link
              key={cat}
              href={`/search?q=${encodeURIComponent(cat)}`}
              className={styles.categoryCard}
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
