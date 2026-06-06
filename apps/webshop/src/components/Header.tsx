import { useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { CartContext } from '../pages/_app';
import { SearchDialog } from './SearchDialog';
import { CartIcon } from './cartIcon';
import { useDebounce } from '../hooks/useDebounce';
import { fetchGraphQL } from '../utils/fetchGraphQL';
import type { SearchResult } from '../types';
import styles from './Header.module.css';

const SEARCH_QUERY = `
  query Search($q: String!) {
    searchProducts(query: $q) {
      id
      name
      price
      imageUrl
      description
      stock
      createdAt
    }
  }
`;

export function Header() {
  const router = useRouter();
  const context = useContext(CartContext);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<SearchResult>>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    fetchGraphQL<{ searchProducts: Array<SearchResult> }>(SEARCH_QUERY, {
      q: debouncedQuery,
    })
      .then(data => {
        const hits = data.searchProducts.slice(0, 5);
        setResults(hits);
        setIsOpen(hits.length > 0);
      })
      .catch(() => {
        setResults([]);
        setIsOpen(false);
      });
  }, [debouncedQuery]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      router.push('/search?q=' + encodeURIComponent(query));
      setIsOpen(false);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const isActivePage = (path: string) => {
    return router.pathname === path;
  };

  const totalItems = context?.cart.totalItems ?? 0;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label="Kramp — Home">
          Kramp
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          <Link
            href="/"
            className={isActivePage('/') ? styles.activeLink : styles.navLink}
            aria-current={isActivePage('/') ? 'page' : undefined}
          >
            Home
          </Link>
          <Link
            href="/search"
            className={
              isActivePage('/search') ? styles.activeLink : styles.navLink
            }
            aria-current={isActivePage('/search') ? 'page' : undefined}
          >
            Products
          </Link>
          <Link
            href="/checkout"
            className={
              isActivePage('/checkout') ? styles.activeLink : styles.navLink
            }
            aria-current={isActivePage('/checkout') ? 'page' : undefined}
          >
            Checkout
          </Link>
        </nav>

        <div className={styles.searchWrapper} ref={searchWrapperRef}>
          <label htmlFor="header-search" className={styles.srOnly}>
            Search products
          </label>
          <input
            id="header-search"
            type="search"
            value={query}
            placeholder="Search products..."
            className={styles.searchInput}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-expanded={isOpen}
            aria-autocomplete="list"
            aria-controls="search-results"
            role="combobox"
            autoComplete="off"
          />
          {isOpen && (
            <SearchDialog
              id="search-results"
              results={results}
              onSelect={(id: string) => {
                router.push(`/product/${id}`);
                setIsOpen(false);
                setQuery('');
              }}
            />
          )}
        </div>
        <CartIcon count={totalItems} />
      </div>
    </header>
  );
}
