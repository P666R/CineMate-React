import React from 'react';
import ReactDOM from 'react-dom/client';
import StarRating from './StarRating';

function Test(): React.JSX.Element {
  const [movieRating, setMovieRating] = React.useState(0);
  return (
    <div>
      <StarRating color="blue" maxRating={10} onSetRating={setMovieRating} />
      <p>This movie was rated {movieRating} stars</p>
    </div>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <StarRating
      maxRating={5}
      messages={['Terrible', 'Bad', 'Okay', 'Good', 'Excellent']}
    />
    <StarRating
      size={48}
      color="green"
      maxRating={8}
      className="test"
      defaultRating={3}
    />
    <Test />
  </React.StrictMode>
);
