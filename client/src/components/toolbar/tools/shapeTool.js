import {
  Menu,
  MenuItem,
} from '@material-ui/core';
import React, {
  useState,
} from 'react';
import Square from '../../../resources/svg/square.svg';

const SHAPES = Object.freeze({
  SQUARE: 'square',
});

const ShapeTool = ({
  handleChange,
}) => {
  const [
    isMenuVisible,
    setIsMenuVisible,
  ] = useState(false);

  return (
    <div
      onClick={() => {
        return setIsMenuVisible(true);
      }} style={{
        backgroundColor: 'black',
        height: '50px',
        width: '50px',
      }}
    >
      <Menu
        onClose={() => {
          return setIsMenuVisible(false);
        }}
        open={isMenuVisible}
      >
        {Object.values(SHAPES).map((shape) => {
          return (
            <MenuItem
              key={shape} onClick={() => {
                return handleChange(shape);
              }}
            ><img alt={shape} src={Square} /></MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};

export default ShapeTool;
