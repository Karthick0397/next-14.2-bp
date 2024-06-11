import Head from "next/head";

const GoogleAnalytics = () => (
  <Head>
    {/* Google Tag Manager */}
    {/* <script async src='https://www.googletagmanager.com/gtag/js?id=G-LL9WLCT8FY' /> */}
    {/* <script
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-LL9WLCT8FY');
        `,
      }}
    /> */}
    {/* End Google Tag Manager */}
  </Head>
);

export default GoogleAnalytics;
