import React from 'react';
import ZoomInIcon from './../../../public/resources/consistentsvg/zoom-in.svg';
import Image from "next/image";

const ZoomInTool = ({
  zoomIn,
}) => {
  return (
    <div>
      <Image priority={true} alt='Zoom In' draggable={false} onClick={zoomIn} src={ZoomInIcon} />
    </div>
  );
};

export default ZoomInTool;
