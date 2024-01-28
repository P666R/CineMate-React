import React from 'react';

//! ErrorMessage (stateless/presentational component)
export default function ErrorMessage({
  error,
}: {
  error: string;
}): React.JSX.Element {
  return (
    <p className="error">
      <span>❌</span> {error}
    </p>
  );
}
