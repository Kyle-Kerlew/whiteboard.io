import React from 'react';

const Circle = ({
  size,
  onClick,
  color,
}) => {
  return (
    <svg height={size} onClick={onClick} width={size} xmlns='http://www.w3.org/2000/svg'>
      <circle cx={size / 2} cy={size / 2} fill={color} r='15' stroke={color} strokeWidth={size / 2.5} />
    </svg>
  );
};

export default Circle;
