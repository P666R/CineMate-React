import React from 'react';
import { Movie } from './App';
import MovieItem from './MovieItem';

type MovieListProps = {
  movies: Movie[];
  onSelectMovie: (id: string) => void;
};

//! MovieList (stateful component)
export default function MovieList({
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
