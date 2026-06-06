import Link from 'next/link';
import styles from './cartIcon.module.css';

interface CartIconProps {
  count: number;
}

export function CartIcon({ count }: CartIconProps) {
  const label =
    count > 0 ? `Cart (${count} item${count === 1 ? '' : 's'})` : 'Cart';

  return (
    <Link href="/checkout" className={styles.cartIcon} aria-label={label}>
      <span className={styles.label} aria-hidden="true">
        Cart
      </span>
      {count > 0 && (
        <span className={styles.badge} aria-hidden="true">
          {count}
        </span>
      )}
    </Link>
  );
}
