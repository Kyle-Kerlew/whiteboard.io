import React from 'react';
import RedoIcon from '../../../resources/svg/redo-icon.svg';
import UndoIcon from '../../../resources/svg/undo-icon.svg';

const UndoRedoTool = ({
  onUndo,
  onRedo,
}) => {
  return (
    <div style={{
      display: 'flex',
      gap: '5px',
    }}
    >
      <div draggable={false} onClick={onUndo}>
        <img alt='Undo' src={UndoIcon} />
      </div>
      <div draggable={false} onClick={onRedo}>
        <img alt='Redo' src={RedoIcon} />
      </div>
    </div>
  );
};

export default UndoRedoTool;
