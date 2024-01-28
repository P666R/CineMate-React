import { useEffect, useState } from 'react';
import { Movie } from './App';

const KEY: string = '9c76e652';

export function useMovies(query: string, callback: () => void) {
  const [movies, setMovies] = useState<Movie[]>([] as Movie[]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(
    function () {
      callback?.();

      const controller = new AbortController();
      const debouncedQuery = query;

      if (debouncedQuery.length < 3) {
        setMovies([]);
        setError('');
        return;
      }

      const timeoutId = setTimeout(async function fetchMovies(): Promise<void> {
        try {
          setIsLoading(true);
          setError('');
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${debouncedQuery}`,
            { signal: controller.signal }
          );
          if (!res.ok) throw new Error('Something went wrong with the request');
          const data = await res.json();
          if (data.Response === 'False') throw new Error('Movie not found');
          setMovies(data.Search);
        } catch (error: Error | any) {
          if (error.name !== 'AbortError') {
            setError(error.message);
          }
        } finally {
          setIsLoading(false);
        }
      }, 500);

      return function () {
        clearTimeout(timeoutId);
        controller.abort();
      };
    },
    [query, callback]
  );

  return { movies, isLoading, error };
}
