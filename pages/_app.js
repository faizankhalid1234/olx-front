import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import Head from 'next/head';
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.error('Service worker registration failed:', error);
    });
  }, []);

  return (
    <>
      <Head>
        <title>OLX Frontend - Buy and Sell Online</title>
        <meta
          name="description"
          content="Browse and post ads for mobiles, cars, property, jobs, and more on OLX Frontend."
        />
        <meta name="keywords" content="OLX, classifieds, buy, sell, ads, Pakistan" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#002f34" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="OLX Frontend" />
        <meta property="og:title" content="OLX Frontend - Buy and Sell Online" />
        <meta
          property="og:description"
          content="Pakistan's marketplace for buying and selling used items."
        />
        <meta property="og:url" content="http://localhost:3000/" />
        <meta property="og:image" content="/icons/icon-512.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="OLX Frontend - Buy and Sell Online" />
        <meta
          name="twitter:description"
          content="Browse and post ads for mobiles, cars, property, jobs, and more."
        />
        <meta name="twitter:image" content="/icons/icon-512.svg" />
        <link rel="canonical" href="http://localhost:3000/" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon-192.svg" />
      </Head>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}
