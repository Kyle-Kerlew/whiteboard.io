import React, {
  useState,
} from 'react';
import DownloadIcon from '../../../resources/consistentsvg/download.svg';

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
        <img alt='Download Drawing as Image' draggable={false} src={DownloadIcon} />
      </a>
    </div>
  );
};

export default DownloadImageTool;
