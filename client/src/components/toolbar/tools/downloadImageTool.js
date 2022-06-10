import React, {
  useState,
} from 'react';
import DownloadIcon from '../../../resources/svg/download-icon.svg';

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
