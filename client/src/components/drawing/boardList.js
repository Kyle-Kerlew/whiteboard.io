import React, {
  useEffect,
  useState,
} from 'react';
import {
  UserController,
} from '../../handlers/rest/userController';
import '../../styles/boardList.css';
import ActiveUsers from '../navigation/activeUsers';
import Loading from '../shared/loading';

const BoardList = () => {
  const [
    boardList,
    setBoardList,
  ] = useState([]);
  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  async function getBoards () {
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
      <div className='item-container'>
        {isLoading &&
        <Loading />}
        {boardList.length > 0 &&
                boardList.map((board) => <div className='item' key={board._id}>
                  <div className='item-title'>{board.title}</div>
                  <ActiveUsers collaborators={[
                    ...board.collaborators,
                  ]}
                  />
                </div>)}
      </div>
    </div>
  );
};

export default BoardList;
