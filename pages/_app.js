import App from 'next/app';
import '../pages/main.css';
import '../styles/globals.css';

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    return { pageProps };
  }
  
  render() {
    const { Component, pageProps } = this.props;

    return (
      <Component {...pageProps} />
    );
  }
}