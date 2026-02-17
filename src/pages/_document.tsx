import Document, { Head, Html, Main, NextScript, type DocumentContext } from 'next/document';

type Props = {
  locale: string;
};

export default class MyDocument extends Document<Props> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      locale: ctx.locale ?? 'de'
    };
  }

  render() {
    const locale = this.props.locale || 'de';

    return (
      <Html lang={locale}>
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#040509" />
          <meta name="color-scheme" content="dark" />

          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="icon" href="/assets/logo.png" type="image/png" />
          <link rel="apple-touch-icon" href="/assets/logo.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
