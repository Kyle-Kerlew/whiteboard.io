import React from 'react';
import ZoomInIcon from '../../../resources/svg/zoom-in-icon.svg';

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
