import React from 'react';
import ZoomOutIcon from './../../../public/resources/consistentsvg/zoom-out.svg';
import Image from "next/image";

const ZoomOutTool = ({
  zoomOut,
}) => {
  return (
    <div>
      <Image priority={true} alt='Zoom Out' draggable={false} onClick={zoomOut} src={ZoomOutIcon} />
    </div>
  );
};

export default ZoomOutTool;
