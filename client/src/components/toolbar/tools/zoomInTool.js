import React from 'react';
import ZoomInIcon from '../../../resources/consistentsvg/zoom-in.svg';

const ZoomInTool = ({
  zoomIn,
}) => {
  return (
    <div>
      <img alt='Zoom In' draggable={false} onClick={zoomIn} src={ZoomInIcon} />
    </div>
  );
};

export default ZoomInTool;
