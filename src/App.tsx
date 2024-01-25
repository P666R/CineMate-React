import React, { useEffect, useState } from 'react';
import StarRating from './StarRating';

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

//! generic function to calculate average
const average = (arr: number[]): number =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY: string = '9c76e652';

//! App (structural component) eliminated prop drilling using component composition
function App(): React.JSX.Element {
  const [query, setQuery] = useState<string>('gun');
  const [movies, setMovies] = useState<Movie[]>([] as Movie[]);
  const [watched, setWatched] = useState<WatchedMovie[]>([] as WatchedMovie[]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string>(null);

  function handleSelectMovie(id: string): void {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  function handleCloseMovie(): void {
    setSelectedId(null);
  }

  function handleAddWatched(movie: WatchedMovie): void {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id: string): void {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(
    function () {
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
  watched: WatchedMovie[];
  onCloseMovie: () => void;
  onAddWatched: (movie: WatchedMovie) => void;
};

//! MovieDetails (stateless/presentational component)
function MovieDetails({
  selectedId,
  watched,
  onCloseMovie,
  onAddWatched,
}: MovieDetailsProps): React.JSX.Element {
  type Movie = {
    Title: string;
    Year: string;
    Poster: string;
    Runtime: string;
    imdbRating: string;
    Plot: string;
    Released: string;
    Actors: string;
    Director: string;
    Genre: string;
  };

  const [movie, setMovie] = useState<Movie>({} as Movie);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [userRating, setUserRating] = useState<number>(0);

  const isWatched = watched.some(
    (watchedMovie) => watchedMovie.imdbID === selectedId
  );

  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      Title: title,
      Year: year,
      Poster: poster,
      runtime: Number(runtime.split(' ').at(0)),
      imdbRating: Number(imdbRating),
      userRating,
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useEffect(
    function () {
      async function getMovieDetails(): Promise<void> {
        try {
          setIsLoading(true);
          setError('');
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
          );

          if (!res.ok) throw new Error('Something went wrong with the request');

          const data = await res.json();

          if (data.Response === 'False') throw new Error('Movie not found');

          setMovie(data);
        } catch (error: Error | any) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      }

      getMovieDetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = 'CineMate';
      };
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading && <Loader />}
      {!isLoading && !error && (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`${title} poster`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />

                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated this movie {watchedUserRating} <span>⭐</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
      {error && <ErrorMessage error={error} />}
    </div>
  );
}

type WatchedSummaryProps = {
  watched: WatchedMovie[];
};

//! WatchedSummary (stateless/presentational component)
function WatchedSummary({ watched }: WatchedSummaryProps): React.JSX.Element {
  // console.log(watched[0].userRating);
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
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
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
  onDeleteWatched: (id: string) => void;
};

//! WatchedMoviesList (stateless/presentational component)
function WatchedMoviesList({
  watched,
  onDeleteWatched,
}: WatchedMoviesListProps): React.JSX.Element {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovieItem
          key={movie.imdbID}
          movie={movie}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}

type WatchedMovieItemProps = {
  movie: WatchedMovie;
  onDeleteWatched: (id: string) => void;
};

//! WatchedMovieItem (stateless/presentational component)
function WatchedMovieItem({
  movie,
  onDeleteWatched,
}: WatchedMovieItemProps): React.JSX.Element {
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
        <button
          className="btn-delete"
          onClick={() => onDeleteWatched(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}

export default App;
