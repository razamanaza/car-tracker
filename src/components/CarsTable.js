import React, { useMemo } from 'react';
import Spinner from '@/components/Spinner';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function CarsTable() {
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

  const displayData = data.data;
  console.log(displayData);

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Year</th>
          <th>Mileage</th>
        </tr>
      </thead>
      <tbody>
        {displayData.map((row) => (
          <tr key={row.link}>
            <td>
              <a href={row.link} target="_blank">
                {row.name}
              </a>
              <br />
              {row.description}
            </td>
            <td>{row.price}</td>
            <td>{row.year}</td>
            <td>{row.mileage}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
