import React, {useState} from 'react';
import { useSelector} from "react-redux";

import {
    Socket,
} from '../../configuration/socket';
import "../../styles/editableTitle.css";

import {useRouteMatch} from "react-router-dom";

const EditableTitle = () => {
    const currTitle = useSelector((state) => state.whiteboard.value.title);

    const {
        canvasId: whiteboardId,
    } = useRouteMatch('/boards/:canvasId').params;
    const [formTitle, setTitle] = useState();
    const handleChange = (title) => {

        setTitle(title);
    }
    const handleSubmit = (title) => {
        if (!title) {
            setTitle(currTitle);
            return;
        }

        Socket.emit('update-title', {whiteboardId, title: title?.trim()});
    }
    return (
        <>
            <form onSubmit={(e) => e.preventDefault()}>
                <input
                    type="text"
                    className="title"
                    value={formTitle ?? currTitle}
                    onBlur={() => handleSubmit(formTitle)}
                    style={{margin: '0'}}
                    spellCheck={false}
                    contentEditable
                    name="title"
                    onChange={(e) => handleChange(e.currentTarget.value)}
                />
            </form>
        </>
    );
};

export default EditableTitle;
