import React from 'react';
import RedoIcon from '../../../resources/svg/redo-icon.svg';
import UndoIcon from '../../../resources/svg/undo-icon.svg';

const UndoRedoTool = ({
  onUndo,
  onRedo,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '5px',
      }}
    >
      <div onClick={onUndo}>
        <img alt='Undo' draggable={false} src={UndoIcon} />
      </div>
      <div onClick={onRedo}>
        <img alt='Redo' draggable={false} src={RedoIcon} />
      </div>
    </div>
  );
};

export default UndoRedoTool;
