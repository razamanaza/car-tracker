import Head from 'next/head';
import CarsTable from '@/components/CarsTable';

export default function Home() {
  return (
    <>
      <Head>
        <title>Car tracker</title>
        <meta name="description" content="Car tracker test app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="container p-6 grid place-content-center min-h-screen bg-white">
          <h1 className="text-xl text-red-800 font-semibold mb-4">
            Cars from traders in Dunedin
          </h1>
          <CarsTable />
        </div>
      </main>
    </>
  );
}
