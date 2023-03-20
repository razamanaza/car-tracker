import React, { useMemo, useState } from 'react';
import Spinner from '@/components/Spinner';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function CarsTable({ priceLimit }) {
  const { data, error, isLoading } = useSWR('/api/cars', fetcher);

  if (error)
    return (
      <div
        className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
        role="alert"
      >
        <span className="font-medium">Failed to fetch API!</span>
      </div>
    );
  if (isLoading) return <Spinner />;

  const displayData = data.data.filter((carData) =>
    priceLimit ? Number(carData.price) <= priceLimit : true
  );
  console.log(displayData);

  return (
    <table className="w-full min-w-[800px] text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="px-6 py-3">
            Name
          </th>
          <th scope="col" className="px-6 py-3">
            Price
          </th>
          <th scope="col" className="px-6 py-3">
            Mileage
          </th>
          <th scope="col" className="px-6 py-3">
            Year
          </th>
          <th scope="col" className="px-6 py-3">
            Trader
          </th>
        </tr>
      </thead>
      <tbody>
        {displayData.map((row) => (
          <tr
            key={row.link}
            className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
          >
            <td className="px-6 py-4">
              <a
                href={row.link}
                target="_blank"
                className="text-blue-600 dark:text-blue-500 hover:underline"
              >
                {row.name}
              </a>
              <br />
              {row.description}
            </td>
            <td className="px-6 py-4">{row.price}</td>
            <td className="px-6 py-4">{row.mileage}</td>
            <td className="px-6 py-4">{row.year}</td>
            <td className="px-6 py-4">{row.trader}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
