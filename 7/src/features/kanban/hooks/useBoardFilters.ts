import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { parseBoardFilters } from '../utils/urlState';

export function useBoardFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => parseBoardFilters(searchParams),
    [searchParams],
  );

  return {
    filters,
    searchParams,
    setSearchParams,
  };
}
