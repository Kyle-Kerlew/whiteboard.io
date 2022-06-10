import React from 'react';
import ZoomOutIcon from '../../../resources/svg/zoom-out-icon.svg';

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
