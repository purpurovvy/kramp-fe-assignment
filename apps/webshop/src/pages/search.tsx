import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { groupBy } from '../utils/groupBy';
import { fetchGraphQL } from '../utils/fetchGraphQL';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types';
import styles from './search.module.css';

const SEARCH_QUERY = `
  query SearchProducts($q: String!) {
    searchProducts(query: $q) {
      id
      name
      price
      imageUrl
      category
      description
      stock
      createdAt
    }
  }
`;

export default function SearchPage() {
  const router = useRouter();
  const [results, setResults] = useState<Array<Product>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const q = typeof router.query.q === 'string' ? router.query.q : '';

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    setIsLoading(true);

    fetchGraphQL<{ searchProducts: Array<Product> }>(SEARCH_QUERY, { q })
      .then(data => {
        setResults(data.searchProducts ?? []);
        setIsLoading(false);
      })
      .catch(() => {
        setResults([]);
        setIsLoading(false);
      });
  }, [router.isReady, q]);

  const grouped = groupBy(results, 'category');

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.heading}>
          {q ? `Results for "${q}"` : 'All products'}
        </h1>

        {isLoading && <p>Loading...</p>}

        {!isLoading && results.length === 0 && (
          <p className={styles.empty}>No products found.</p>
        )}

        {Object.keys(grouped).map(category => (
          <section key={category} className={styles.category}>
            <h2 className={styles.categoryTitle}>{category}</h2>
            <div className={styles.grid}>
              {grouped[category].map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
