import Head from 'next/head';

function HeadComponent({ title = '' }) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content="Generated by create next app" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}

export default HeadComponent;
