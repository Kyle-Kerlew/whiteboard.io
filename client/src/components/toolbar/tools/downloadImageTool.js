import React, {useState} from 'react';
import DownloadIcon from "../../../resources/svg/download-icon.svg";

function DownloadImageTool({width = "36px", height = "36px", getDownloadData}) {
    const [downloadData, setDownloadData] = useState();
    return (
        <div>
            <a download={'whiteboard-image.png'} onClick={() => setDownloadData(getDownloadData())}
               href={downloadData}><img width={width} height={height} src={DownloadIcon}
                                        alt="Download Drawing as Image"/></a>
        </div>
    )
}

export default DownloadImageTool;