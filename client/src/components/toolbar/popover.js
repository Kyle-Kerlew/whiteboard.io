import React from 'react';
import '../../styles/popover.css';
import {v4 as uuidv4} from 'uuid';
import {useHistory} from "react-router-dom";
import {Socket} from '../socket/socket';
import NewWhiteBoardIcon from '../../resources/svg/new-whiteboard-icon.svg';

function Popover() {
    const history = useHistory();

    function createNewWhiteboard() {
        const whiteboardUuid = btoa(uuidv4());
        history.push(`/${whiteboardUuid}`);
        Socket.emit('create-whiteboard', {
            whiteboardId: whiteboardUuid,
            data: []
        })
    }

    return (
        <div className="grayed-background">
            <div className="content">
                <h1 onClick={createNewWhiteboard}>Create New Whiteboard</h1>
                <img alt="New Whiteboard" width="150px" height="150px" src={NewWhiteBoardIcon}/>
            </div>
        </div>
    )
}

export default Popover;