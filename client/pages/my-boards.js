import React, {
    useEffect,
    useState,
} from 'react';
import {
    UserController,
} from './../handlers/rest/userController';
import './../styles/BoardList.module.css';
import ActiveUsers from './../components/navigation/activeUsers';
import Loading from './../components/shared/loading';

const MyBoards = () => {
    const [
        boardList,
        setBoardList,
    ] = useState([]);
    const [
        isLoading,
        setIsLoading,
    ] = useState(false);

    async function getBoards() {
        try {
            const result = await UserController.listWhiteboards();
            setBoardList(result);
            setIsLoading(false);
        } catch {
            // todo: toast
        }
    }

    useEffect(() => {
        setIsLoading(true);
        getBoards();
    }, []);

    return (
        <div>
            <div className='page-title'>
                <h1>Your Whiteboards</h1>
            </div>
            <div className='item-container container-xl'>
                {isLoading &&
                    <Loading/>
                }
                {boardList.length > 0 &&
                    boardList.map((board) => {
                        return (
                            <a href={`/boards/${board._id}`} className='item' key={board._id}>
                                <div className='item-title'>{board.title}</div>
                                <div className='item-updated-at'>Last
                                    Modified {new Date(board.lastUpdated).toLocaleString()}</div>
                                <ActiveUsers collaborators={[
                                    ...board.collaborators,
                                ]}
                                />
                            </a>)
                    })
                }
            </div>
        </div>
    );
};

export default MyBoards;
