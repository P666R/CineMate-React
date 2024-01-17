import React, { useState } from 'react';

const containerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
};

const starContainerStyle: React.CSSProperties = {
  display: 'flex',
};

type StarRatingProps = {
  maxRating?: number;
  color?: string;
  size?: number;
  className?: string;
  messages?: string[];
  defaultRating?: number;
  onSetRating?: React.Dispatch<React.SetStateAction<number>>;
};

function StarRating({
  maxRating = 5,
  color = '#fcc419',
  size = 48,
  className = '',
  messages = [],
  defaultRating = 0,
  onSetRating = () => {},
}: StarRatingProps): React.JSX.Element {
  const [rating, setRating] = useState<number>(defaultRating);
  const [tempRating, setTempRating] = useState<number>(0);

  const styleText: React.CSSProperties = {
    lineHeight: '1',
    margin: '0',
    color,
    fontSize: `${size / 2}px`,
  };

  function handleRating(val: number) {
    setRating(val === rating ? 0 : val);
    onSetRating(val === rating ? 0 : val);
  }

  return (
    <div style={containerStyle} className={className}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, idx) => (
          <Star
            key={idx}
            onRate={() => handleRating(idx + 1)}
            onHoverIn={() => setTempRating(idx + 1)}
            onHoverOut={() => setTempRating(0)}
            full={tempRating ? tempRating >= idx + 1 : rating >= idx + 1}
            color={color}
            size={size}
          />
        ))}
      </div>
      <p style={styleText}>
        {messages.length === maxRating
          ? messages[tempRating ? tempRating - 1 : rating - 1]
          : tempRating || rating || ''}
      </p>
    </div>
  );
}

type StarProps = {
  onRate: () => void;
  onHoverIn: () => void;
  onHoverOut: () => void;
  full: boolean;
  color: string;
  size: number;
};

function Star({
  onRate,
  full,
  onHoverIn,
  onHoverOut,
  color,
  size,
}: StarProps): React.JSX.Element {
  const startStyle: React.CSSProperties = {
    height: `${size}px`,
    width: `${size}px`,
    display: 'block',
    cursor: 'pointer',
  };

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
        fill={full ? color : 'none'}
        stroke={color}
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </span>
  );
}

export default StarRating;
