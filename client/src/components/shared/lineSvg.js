const LineSvg = ({
  startX,
  startY,
  endX,
  endY,
  color,
  width,
}) => {
  return (
    <svg>
      <line style='stroke:rgb(255,0,0);stroke-width:2' x1='0' x2='200' y1='0' y2='200' />
    </svg>
  );
};

export default LineSvg;
