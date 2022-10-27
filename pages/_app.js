import App from 'next/app';
import '../styles/Pages.home.css';
import '../styles/globals.css';

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {  // Constructor of MyApp, called by nextjs
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    return { pageProps };
  }
  
  render() {
    const { Component, pageProps } = this.props;  // props initialized in constructor above

    return (  // Returning component its own props
      <Component {...pageProps} />
    );
  }
}