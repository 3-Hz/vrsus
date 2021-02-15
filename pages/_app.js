import '../styles/globals.css';
import '../styles/styles.css';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>VRSUS</title>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <div className="nav-wrapper">
        <div className="top-bar">
          <div className="logo">
            <Image
              src="/logo.png"
              alt="logo"
              layout="fill"
              objectFit="contain"
              objectPosition="left"
            ></Image>
          </div>
          <div className="nav">
            <Link href="/">
              <a>Home</a>
            </Link>
            <Link href="/tournaments">
              <a>Tournaments</a>
            </Link>
            <Link href="tournaments/new">
              <a>Create</a>
            </Link>
          </div>
        </div>
      </div>

      <div>
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default MyApp;