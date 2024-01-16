import React from 'react';

const containerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
};

const starContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '4px',
};

const styleText: React.CSSProperties = {
  lineHeight: '1',
  margin: '0',
};

type StarRatingProps = {
  maxRating?: number;
};

function StarRating({ maxRating = 5 }: StarRatingProps): React.JSX.Element {
  return (
    <div style={containerStyle}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, idx) => (
          <span key={idx}>S{idx + 1}</span>
        ))}
      </div>
      <p style={styleText}>10</p>
    </div>
  );
}

export default StarRating;
