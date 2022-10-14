import React from 'react';
import RedoIcon from '../../../resources/consistentsvg/redo.svg';
import UndoIcon from '../../../resources/consistentsvg/undo.svg';

const UndoRedoTool = ({
  onUndo,
  onRedo,
}) => {
  return (
    <div
        style={{display: 'inherit', gap: "inherit"}}
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
