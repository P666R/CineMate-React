import React from 'react';
import { Movie } from './App';

export type NumresultsProps = {
  movies: Movie[];
};

//! Numresults (stateless/presentational component)
export default function Numresults({
  movies,
}: NumresultsProps): React.JSX.Element {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
