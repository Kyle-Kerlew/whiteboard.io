import React from 'react';
import CrossIcon from './../../../public/resources/consistentsvg/trash.svg';
import Image from "next/image";

const ClearBoardTool = ({
  clearBoard,
}) => {
  function handleOnClick () {
    clearBoard(true);
  }

  return (
    <div>
      <Image priority={true} alt='Clear Board' draggable={false} onClick={handleOnClick} src={CrossIcon} />
    </div>
  );
};

export default ClearBoardTool;
