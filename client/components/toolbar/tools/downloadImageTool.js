import React, {
  useState,
} from 'react';
import DownloadIcon from './../../../public/resources/consistentsvg/download.svg';
import Image from "next/image";

const DownloadImageTool = ({
  getDownloadData,
}) => {
  const [
    downloadData,
    setDownloadData,
  ] = useState();
  return (
    <div>
      <a
        download='whiteboard-image.png'
        href={downloadData}
        onClick={() => setDownloadData(getDownloadData())}
      >
        <Image priority={true} alt='Download Drawing as Image' draggable={false} src={DownloadIcon} />
      </a>
    </div>
  );
};

export default DownloadImageTool;
