import React, {useState} from 'react';
import {useSelector} from "react-redux";

import Socket from '../../configuration/socket';
import style from "../../styles/EditableTitle.module.css";
import {useRouter} from "next/router";

const EditableTitle = () => {
    const currTitle = useSelector((state) => state.whiteboard.value.title);

    const router = useRouter();
    const {
        whiteboard: whiteboardId,
    } = router.query;
    const [formTitle, setTitle] = useState();
    const handleChange = (title) => {

        setTitle(title);
    }
    const handleSubmit = async (title) => {
        if (!title) {
            setTitle(currTitle);
            return;
        }
        const socket = await Socket.getInstance();
        socket.emit('update-title', {whiteboardId, title: title?.trim()});
    }
    return (
        <>
            <form onSubmit={(e) => e.preventDefault()}>
                <input
                    type="text"
                    className={style.title}
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
