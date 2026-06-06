import { useContext, useState } from 'react';
import Link from 'next/link';
import { CartContext } from './_app';
import { formatPrice } from '../utils/formatPrice';
import type { CartItem } from '../types';
import styles from './checkout.module.css';

export default function CheckoutPage() {
  const context = useContext(CartContext);
  const [confirmed, setConfirmed] = useState(false);

  const cart = context?.cart;
  const items: Array<CartItem> = cart?.cart ?? [];

  const handlePlaceOrder = () => {
    cart?.clearCart();
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div className={styles.confirmation}>
        <h1 className={styles.confirmationHeading}>Order placed!</h1>
        <p className={styles.confirmationText}>
          Thank you for your order. You will receive a confirmation email
          shortly.
        </p>
        <Link href="/" className={styles.confirmationLink}>Continue shopping</Link>
      </div>
    );
  }

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.heading}>Checkout</h1>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <p>Your cart is empty.</p>
            <Link href="/" className={styles.continueLink}>
              Continue shopping
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.items}>
              {items.map(item => (
                <div key={item.productId} className={styles.item}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemQty}>×{item.quantity}</span>
                  <span className={styles.itemPrice}>
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.summary}>
              <div className={styles.total}>
                <span>Total</span>
                <strong>{formatPrice(total)}</strong>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.placeOrderButton}
                onClick={handlePlaceOrder}
              >
                Place order
              </button>
              <Link href="/" className={styles.continueLink}>
                Continue shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
