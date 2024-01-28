import React from 'react';
import { WatchedMovie } from './App';
import WatchedMovieItem from './WatchedMovieItem';

type WatchedMoviesListProps = {
  watched: WatchedMovie[];
  onDeleteWatched: (id: string) => void;
};

//! WatchedMoviesList (stateless/presentational component)
export default function WatchedMoviesList({
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
