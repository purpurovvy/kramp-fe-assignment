import type { SearchResult } from '../types';
import styles from './SearchDialog.module.css';

interface SearchDialogProps {
  id: string;
  results: Array<SearchResult>;
  onSelect: (id: string) => void;
}

export function SearchDialog({ id, results, onSelect }: SearchDialogProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <ul
      id={id}
      role="listbox"
      className={styles.dialog}
      aria-label="Search suggestions"
    >
      {results.map(result => (
        <li key={result.id} role="option" aria-selected={false} className={styles.listItem}>
          <button
            type="button"
            className={styles.item}
            onClick={() => onSelect(result.id)}
          >
            <span className={styles.itemName}>{result.name}</span>
            <span className={styles.itemPrice}>€{result.price.toFixed(2)}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
