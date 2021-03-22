import React, {useRef, useState} from 'react';
import './popover.css';
import {v4 as uuidv4} from 'uuid';
import {useHistory} from "react-router-dom";

function Popover() {
    const history = useHistory();
    const [joinExisting, setJoinExisting] = useState(false);
    const fieldValue = useRef();

    function createNewWhiteboard() {
        const whiteboardUuid = btoa(uuidv4());
        history.push(`/${whiteboardUuid}`);
        //todo: store whiteboard ids and data in mongodb
    }

    function handleInput(event) {
        fieldValue.current = event.target.value;
    }

    return (
        <div className="grayed-background">
            <div className="content">
                {joinExisting &&
                <div className={"existing"}>
                    <h1>Enter the ID of the whiteboard</h1>
                    <form onSubmit={() => history.push(`/${fieldValue.current}`)}>
                        <input onChange={handleInput} type={"text"}/>
                        <button type="submit">Submit</button>
                    </form>
                </div>
                }
                {!joinExisting &&
                <>
                    <div className={"new"}>
                        <h1 onClick={createNewWhiteboard}>Create New Whiteboard</h1>
                    </div>
                    <div onClick={() => setJoinExisting(true)} className={"existing"}>
                        <h1>Join Existing Whiteboard</h1>
                    </div>
                </>
                }
            </div>
        </div>
    )
}

export default Popover;