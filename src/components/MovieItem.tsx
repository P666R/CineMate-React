import React from 'react';
import { Movie } from './App';

export type MovieItemProps = {
  movie: Movie;
  onSelectMovie: (id: string) => void;
};

//! MovieItem (stateless/presentational component)
export default function MovieItem({
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
