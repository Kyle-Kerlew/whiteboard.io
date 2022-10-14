import React from 'react';
import ZoomOutIcon from '../../../resources/consistentsvg/zoom-out.svg';

const ZoomOutTool = ({
  zoomOut,
}) => {
  return (
    <div>
      <img alt='Zoom Out' draggable={false} onClick={zoomOut} src={ZoomOutIcon} />
    </div>
  );
};

export default ZoomOutTool;
