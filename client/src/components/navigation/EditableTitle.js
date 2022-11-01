import React, {useRef} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    setTitle,
} from '../../reducers/whiteboardReducer';
const EditableTitle = () => {
    const title = useSelector((state) => state.whiteboard.value.title);
    const formTitle = useRef();
    const dispatch = useDispatch();
    const handleChange = (title) => {
        formTitle.current = title;
        // dispatch(setTitle(title))
    }
    const handleSubmit =(title) => {
        formTitle.current = title;
        dispatch(setTitle(title))
    }
    return (
        <>
            <form>
                <input type="text" defaultValue={title} value={formTitle.current} style={{margin: '0'}} contentEditable name="title" onBlur={(e) => handleSubmit(e.currentTarget.value)} onChange={(e) => handleChange(e.currentTarget.value)}/>
            </form>
        </>
    );
};

export default EditableTitle;
