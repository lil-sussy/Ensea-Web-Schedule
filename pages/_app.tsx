import App from 'next/app';
import '../styles/Pages.home.css';
import '../styles/globals.css';

export default function EWSHome({ Component, pageProps }) {
  return (  // Returning component its own props
    <Component {...pageProps} />
  );
}