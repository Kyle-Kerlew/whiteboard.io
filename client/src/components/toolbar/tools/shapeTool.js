import {
  Button,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Stack,
} from '@mui/material';
import React, {useState,} from 'react';
import Shapes from '../../../types/Shapes';

const ShapeTool = ({
  handleChange,
}) => {
  const [
    open,
    setOpen,
  ] = useState(false);
  const [
    anchorElement,
    setAnchorElement,
  ] = useState(null);

  function handleListKeyDown (event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  const handleAwayClick = () => {
    setOpen(false);
  }

  const handleClick = (event) => {
    setOpen((previouslyOpen) => {
      if (event) {
        setAnchorElement(event.currentTarget);
      }

      return !previouslyOpen;
    });
  };

  function handleOptionSelect (shape) {
    handleChange(shape);
    setOpen(false);
  }

  return (
    <Stack direction="row" spacing={2}>
      <div>
        <Button
          aria-controls={open ?
            'composition-menu' :
            undefined}
          aria-expanded={open ?
            'true' :
            undefined}
          aria-haspopup="true"
          id="composition-button"
          onClick={handleClick}
          ref={anchorElement}
        >
          <div style={{
            border: '3px solid black',
            borderRadius: '6px',
            height: '36px',
            width: '36px',
          }}
          />
        </Button>
        <Popper
          anchorEl={anchorElement}
          disablePortal
          open={open}
          placement="bottom-start"
          transition
        >
          {({
            TransitionProps,
            placement,
          }) => <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom-start' ?
                  'left top' :
                  'left bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleAwayClick}>
                <MenuList
                  aria-labelledby="composition-button"
                  autoFocusItem={open}
                  id="composition-menu"
                  onKeyDown={handleListKeyDown}
                >
                  {Object.values(Shapes)
                    .map((shape) => {
                      return (
                        <MenuItem
                          key={shape}
                          onClick={() => handleOptionSelect(shape)}>
                          {shape}
                        </MenuItem>
                      );
                    })}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>}
        </Popper>
      </div>
    </Stack>
  );
};

export default ShapeTool;
