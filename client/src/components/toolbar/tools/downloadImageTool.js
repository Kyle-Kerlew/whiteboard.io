import React, {useState} from 'react';
import DownloadIcon from "../../../resources/svg/download-icon.svg";

function DownloadImageTool({getDownloadData}) {
    const [downloadData, setDownloadData] = useState();
    return (
        <div>
            <a
                download={'whiteboard-image.png'}
                onClick={() => setDownloadData(getDownloadData())}
                href={downloadData}>
                <img src={DownloadIcon} alt="Download Drawing as Image"/>
            </a>
        </div>
    )
}

export default DownloadImageTool;