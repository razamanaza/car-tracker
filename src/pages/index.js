import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Container from '@mui/material/Container';
import LoadingButton from '@mui/lab/LoadingButton';

export default function Home() {
  return (
    <>
      <Head>
        <title>Car tracker</title>
        <meta name="description" content="Car tracker test app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Container maxWidth="xl" fixed={true} className={styles.container}>
          <LoadingButton loading={true} />
        </Container>
      </main>
    </>
  );
}
