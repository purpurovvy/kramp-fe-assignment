import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { CartContext } from '../_app';
import { fetchGraphQL } from '../../utils/fetchGraphQL';
import { formatPrice } from '../../utils/formatPrice';
import type { Product } from '../../types';
import styles from './[id].module.css';

const GET_PRODUCT_QUERY = `
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      description
      price
      category
      imageUrl
      stock
      createdAt
    }
  }
`;

export default function ProductPage() {
  const router = useRouter();
  const context = useContext(CartContext);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = router.query.id;

  useEffect(() => {
    if (!id || typeof id !== 'string') {
      return;
    }

    setIsLoading(true);
    setError(null);

    fetchGraphQL<{ product: Product | null }>(GET_PRODUCT_QUERY, { id })
      .then(data => {
        setProduct(data.product);
        setIsLoading(false);
      })
      .catch(() => {
        setError('Failed to load product. Please try again.');
        setIsLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !context) {
      return;
    }

    context.cart.addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <p>{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.page}>
        <p>Product not found.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.imageWrapper}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className={styles.image}
          />
        </div>
        <div className={styles.details}>
          <p className={styles.category}>{product.category}</p>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.price}>{formatPrice(product.price)}</p>
          <p className={styles.description}>{product.description}</p>
          <p className={styles.meta}>
            Listed: {new Date(product.createdAt).toLocaleDateString()}
            {' · '}
            {product.stock} in stock
          </p>
          <button
            type="button"
            className={styles.addToCart}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of stock' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
