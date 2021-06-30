import React, {useEffect, useState} from 'react';
import {UserController} from '../../handlers/rest/userController';
import '../../styles/boardList.css';
import ActiveUsers from "../navigation/activeUsers";

function BoardList() {
    const [boardList, setBoardList] = useState([]);

    async function getBoards() {
        try {
            const result = await UserController.listWhiteboards();
            setBoardList(result);
        } catch (e) {
            //todo: toast
        }
    }

    useEffect(() => {
        getBoards()
    }, []);

    return (
        <React.Fragment>
            <div className='page-title'>
                <h1>Your Whiteboards</h1>
            </div>
            <div className='item-container'>
                {boardList.length > 0 &&
                boardList.map(board =>
                    (
                        <div className='item' key={board._id}>
                            <div className='item-title'>{board.title}</div>
                            <ActiveUsers collaborators={[...board.collaborators]}/>
                        </div>
                    ))}
            </div>
        </React.Fragment>
    )
}

export default BoardList;