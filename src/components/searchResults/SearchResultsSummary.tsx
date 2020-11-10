import React from 'react';

interface Props {
  count: number;
  query: string;
}

export const SearchResultsSummary = ({ count, query }: Props) => {
  return (
    <span className="text-lg text-gray-800 font-normal">
      Showing{' '}
      <span data-qa="search-hits" className="font-extrabold">
        {count}
      </span>{' '}
      videos for &quot;
      {query}
      &quot;
    </span>
  );
};
