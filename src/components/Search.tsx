import React, { useRef } from 'react';
import { useKey } from '../hooks/useKey';

export type SearchProps = {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
};

//! Search (stateful component)
export default function Search({
  query,
  setQuery,
}: SearchProps): React.JSX.Element {
  const inputEl = useRef(null);

  //* useKey custom hook
  useKey('Enter', function () {
    //? check if input already focused
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery('');
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}
