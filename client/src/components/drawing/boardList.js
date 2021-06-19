import React, {useEffect, useState} from 'react';
import {UserController} from '../../handlers/rest/userController';
import '../../styles/boardList.css';

function BoardList() {
    const [boardList, setBoardList] = useState();

    // grid display of boards user is a part of
    async function getBoards() {
        try {
            const result = await UserController.listWhiteboards();
            setBoardList(result);
        } catch (e) {
            //todo: toast
        }
    }

    useEffect(() => {
        getBoards();
    })

    return (
        <React.Fragment>
            <div className='page-title'>
                <h1>Your Whiteboards</h1>
            </div>
            <div className='item-container'>
                {boardList &&
                boardList.map(board => {
                    return (
                        <div className='item'>
                            <div className='item-title'>{board.title}</div>
                            <div className='item-collaborators'>{board.collaborators}</div>
                        </div>
                    )
                })}
            </div>
        </React.Fragment>
    )
}

export default BoardList;