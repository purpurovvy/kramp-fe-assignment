import { AppProps } from 'next/app';
import Head from 'next/head';
import { createContext } from 'react';
import { useCart } from '../hooks/useCart';
import { Header } from '../components/Header';
import type { CartItem } from '../types';
import './styles.css';

export interface CartContextValue {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

export interface AppCartContext {
  cart: CartContextValue;
}

export const CartContext = createContext<AppCartContext | null>(null);

function CustomApp({ Component, pageProps }: AppProps) {
  const cart = useCart();

  return (
    <CartContext.Provider value={{ cart }}>
      <Head>
        <title>Kramp Webshop</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <main className="app">
        <Component {...pageProps} />
      </main>
    </CartContext.Provider>
  );
}

export default CustomApp;
