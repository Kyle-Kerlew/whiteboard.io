import React from 'react';
import CrossIcon from '../../../resources/svg/cross-icon.svg';

const ClearBoardTool = ({
  clearBoard,
}) => {
  function handleOnClick () {
    clearBoard(true);
  }

  return (
    <div>
      <img alt='Clear Board' draggable={false} onClick={handleOnClick} src={CrossIcon} />
    </div>
  );
};

export default ClearBoardTool;
