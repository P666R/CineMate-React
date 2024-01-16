import React from 'react';
import ReactDOM from 'react-dom/client';
import StarRating from './StarRating';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <StarRating maxRating={5} />
  </React.StrictMode>
);
