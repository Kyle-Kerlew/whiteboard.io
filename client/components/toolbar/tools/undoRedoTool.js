import React from 'react';
import RedoIcon from './../../../public/resources/consistentsvg/redo.svg';
import UndoIcon from './../../../public/resources/consistentsvg/undo.svg';
import Image from "next/image";
import ShapeDropdownOpen from "../../../public/resources/consistentsvg/shape-dropdown-open.svg";
import ShapeDropdownClosed from "../../../public/resources/consistentsvg/shape-dropdown-closed.svg";

const UndoRedoTool = ({
  onUndo,
  onRedo,
}) => {
  return (
    <div
        style={{display: 'inherit', gap: "inherit"}}
    >
      <div onClick={onUndo}>

        <Image priority={true} alt='undo' draggable={false} src={UndoIcon} />
      </div>
      <div onClick={onRedo}>
        <Image priority={true} alt='redo' draggable={false} src={RedoIcon} />
      </div>
    </div>
  );
};

export default UndoRedoTool;
