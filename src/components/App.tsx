import React, { useCallback, useState } from 'react';
import { useMovies } from '../hooks/useMovies';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import NavBar from '../components/NavBar';
import Numresults from '../components/Numresults';
import Search from '../components/Search';
import Main from '../components/Main';
import Box from '../components/Box';
import MovieList from '../components/MovieList';
import MovieDetails from '../components/MovieDetails';
import WatchedSummary from '../components/WatchedSummary';
import WatchedMoviesList from '../components/WatchedMoviesList';

export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

export interface WatchedMovie extends Movie {
  runtime: number;
  imdbRating: number;
  userRating: number;
}

//! App (structural component) eliminated prop drilling using component composition
function App(): React.JSX.Element {
  const [query, setQuery] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string>(null);

  //* using usecallback hook to memoize the function
  const handleCloseMovie = useCallback(function () {
    setSelectedId(null);
  }, []);

  //* useMovies custom hook
  const { movies, isLoading, error } = useMovies<Movie>(
    query,
    handleCloseMovie
  );

  //* useLocalStorageState custom hook
  const [watched, setWatched] = useLocalStorageState<WatchedMovie[]>(
    [],
    'watched'
  );

  function handleSelectMovie(id: string): void {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  function handleAddWatched(movie: WatchedMovie): void {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id: string): void {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <Numresults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage error={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              watched={watched}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

export default App;
