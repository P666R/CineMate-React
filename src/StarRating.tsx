import React, { useState } from 'react';

const containerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
};

const starContainerStyle: React.CSSProperties = {
  display: 'flex',
};

const styleText: React.CSSProperties = {
  lineHeight: '1',
  margin: '0',
};

type StarRatingProps = {
  maxRating?: number;
};

function StarRating({ maxRating = 5 }: StarRatingProps): React.JSX.Element {
  const [rating, setRating] = useState<number>(0);
  const [tempRating, setTempRating] = useState<number>(0);

  function handleRating(val: number) {
    setRating(val === rating ? 0 : val);
  }

  return (
    <div style={containerStyle}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, idx) => (
          <Star
            key={idx}
            onRate={() => handleRating(idx + 1)}
            onHoverIn={() => setTempRating(idx + 1)}
            onHoverOut={() => setTempRating(0)}
            full={tempRating ? tempRating >= idx + 1 : rating >= idx + 1}
          />
        ))}
      </div>
      <p style={styleText}>{tempRating || rating || ''}</p>
    </div>
  );
}

const startStyle: React.CSSProperties = {
  height: '48px',
  width: '48px',
  display: 'block',
  cursor: 'pointer',
};

type StarProps = {
  onRate: () => void;
  onHoverIn: () => void;
  onHoverOut: () => void;
  full: boolean;
};

function Star({
  onRate,
  full,
  onHoverIn,
  onHoverOut,
}: StarProps): React.JSX.Element {
  return (
    <span
      style={startStyle}
      role="button"
      onClick={onRate}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill={full ? '#000' : 'none'}
        stroke="#000"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </span>
  );
}

export default StarRating;
