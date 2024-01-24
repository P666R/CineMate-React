import React, { useEffect, useState } from 'react';

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

interface WatchedMovie extends Movie {
  runtime: number;
  imdbRating: number;
  userRating: number;
}

const tempMovieData: Movie[] = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
  },
  {
    imdbID: 'tt0133093',
    Title: 'The Matrix',
    Year: '1999',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
  },
  {
    imdbID: 'tt6751668',
    Title: 'Parasite',
    Year: '2019',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg',
  },
];

const tempWatchedData: WatchedMovie[] = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: 'tt0088763',
    Title: 'Back to the Future',
    Year: '1985',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

//! generic function to calculate average
const average = (arr: number[]): number =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY: string = '9c76e652';

//! App (structural component) eliminated prop drilling using component composition
function App(): React.JSX.Element {
  const [query, setQuery] = useState<string>('inception');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [watched, setWatched] = useState<WatchedMovie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string>(null);

  /*
  useEffect(function () {
    console.log('after initial render');
  }, []);

  useEffect(function () {
    console.log('after every render');
  });

  useEffect(
    function () {
      console.log('D');
    },
    [query]
  );

  console.log('during render');
 */

  function handleSelectMovie(id: string): void {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  function handleCloseMovie(): void {
    setSelectedId(null);
  }

  useEffect(
    function () {
      async function fetchMovies(): Promise<void> {
        try {
          setIsLoading(true);
          setError('');

          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`
          );

          if (!res.ok) throw new Error('Something went wrong with the request');

          const data = await res.json();

          if (data.Response === 'False') throw new Error('Movie not found');

          setMovies(data.Search);
        } catch (error: Error | any) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError('');
        return;
      }

      fetchMovies();
    },
    [query]
  );

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
              onCloseMovie={handleCloseMovie}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

//! Loader (stateless/presentational component)
function Loader(): React.JSX.Element {
  return <p className="loader">Loading...</p>;
}

//! ErrorMessage (stateless/presentational component)
function ErrorMessage({ error }: { error: string }): React.JSX.Element {
  return (
    <p className="error">
      <span>❌</span> {error}
    </p>
  );
}

type NavBarProps = {
  children: React.ReactNode;
};

//! Navbar (structural component)
function NavBar({ children }: NavBarProps): React.JSX.Element {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

type NumresultsProps = {
  movies: Movie[];
};

//! Numresults (stateless/presentational component)
function Numresults({ movies }: NumresultsProps): React.JSX.Element {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

//! Logo (stateless/presentational component)
function Logo(): React.JSX.Element {
  return (
    <div className="logo">
      <span role="img">🎥</span>
      <h1>CineMate</h1>
    </div>
  );
}

type SearchProps = {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
};

//! Search (stateful component)
function Search({ query, setQuery }: SearchProps): React.JSX.Element {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

type MainProps = {
  children: React.ReactNode;
};

//! Main (structural component)
function Main({ children }: MainProps): React.JSX.Element {
  return <main className="main">{children}</main>;
}

type ListBoxProps = {
  children: React.ReactNode;
};

//! Box (stateful component) made resusable using component composition
function Box({ children }: ListBoxProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? '–' : '+'}
      </button>

      {isOpen && children}
    </div>
  );
}

type MovieListProps = {
  movies: Movie[];
  onSelectMovie: (id: string) => void;
};

//! MovieList (stateful component)
function MovieList({
  movies,
  onSelectMovie,
}: MovieListProps): React.JSX.Element {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <MovieItem
          key={movie.imdbID}
          movie={movie}
          onSelectMovie={onSelectMovie}
        />
      ))}
    </ul>
  );
}

type MovieItemProps = {
  movie: Movie;
  onSelectMovie: (id: string) => void;
};

//! MovieItem (stateless/presentational component)
function MovieItem({
  movie,
  onSelectMovie,
}: MovieItemProps): React.JSX.Element {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

type MovieDetailsProps = {
  selectedId: string;
  onCloseMovie: () => void;
};

//! MovieDetails (stateless/presentational component)
function MovieDetails({
  selectedId,
  onCloseMovie,
}: MovieDetailsProps): React.JSX.Element {
  return (
    <div className="details">
      <button className="btn-back" onClick={onCloseMovie}>
        &larr;
      </button>
      {selectedId}
    </div>
  );
}

type WatchedSummaryProps = {
  watched: WatchedMovie[];
};

//! WatchedSummary (stateless/presentational component)
function WatchedSummary({ watched }: WatchedSummaryProps): React.JSX.Element {
  //! derived states
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

type WatchedMoviesListProps = {
  watched: WatchedMovie[];
};

//! WatchedMoviesList (stateless/presentational component)
function WatchedMoviesList({
  watched,
}: WatchedMoviesListProps): React.JSX.Element {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovieItem key={movie.imdbID} movie={movie} />
      ))}
    </ul>
  );
}

type WatchedMovieItemProps = {
  movie: WatchedMovie;
};

//! WatchedMovieItem (stateless/presentational component)
function WatchedMovieItem({ movie }: WatchedMovieItemProps): React.JSX.Element {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}

export default App;
