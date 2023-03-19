import { useState } from 'react';
import Head from 'next/head';
import CarsTable from '@/components/CarsTable';

export default function Home() {
  const [priceLimit, setPriceLimit] = useState(null);

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
          <div className="flex flex-row justify-between items-center mb-4">
            <h1 className="text-xl text-red-800 font-semibold">
              Cars from traders in Dunedin
            </h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPriceLimit(e.target.elements.price.value);
              }}
            >
              <div className="flex flex-row justify-end items-center gap-x-2">
                <label
                  htmlFor="price"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Price limit
                </label>
                <input
                  type="number"
                  id="price"
                  className="block bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                ></input>
                <button
                  type="submit"
                  className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Set
                </button>
              </div>
            </form>
          </div>
          <CarsTable priceLimit={priceLimit} />
        </div>
      </main>
    </>
  );
}
