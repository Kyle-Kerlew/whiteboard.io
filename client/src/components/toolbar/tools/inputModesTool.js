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
import React, {
  useState,
} from 'react';
import MarkerIcon from '../../../resources/svg/marker-icon.svg';

const InputModesTool = ({
  handleMarkerClick,
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
  };

  const handleClick = (event) => {
    setOpen((previouslyOpen) => {
      if (event) {
        setAnchorElement(event.currentTarget);
      }

      return !previouslyOpen;
    });
  };

  function handleOptionSelect (shape) {
    handleMarkerClick(shape);
    setOpen(false);
  }

  function getSizeInt (sizeString) {
    switch (sizeString) {
    case 'Small':
      return 5;
    case 'Medium':
      return 30;
    case 'Large':
      return 55;
    default:
      return 30;
    }
  }

  const sizes = [
    'Small',
    'Medium',
    'Large',
  ];

  return (
    <Stack direction='row' height={32} pacing={2} width={32}>
      <div style={{
        height: '36px',
        width: '36px',
      }}
      >
        <Button
          aria-controls={open ?
            'composition-menu' :
            undefined}
          aria-expanded={open ?
            'true' :
            undefined}
          aria-haspopup='true'
          fullWidth={false}
          id='composition-button'
          onClick={handleClick}
          ref={anchorElement}
          style={{
            height: '36px',
            minWidth: '36px',
            padding: 'unset',
            width: '36px',
          }}
        >
          <img
            alt='Marker Options'
            draggable={false}
            height='36px'
            src={MarkerIcon}
            width='36px'
          />
        </Button>
        <Popper
          anchorEl={anchorElement}
          disablePortal
          open={open}
          placement='bottom-start'
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
                  aria-labelledby='composition-button'
                  autoFocusItem={open}
                  id='composition-menu'
                  onKeyDown={handleListKeyDown}
                >
                  {sizes.map((size) => {
                    return (
                      <MenuItem
                        key={size}
                        onClick={() => handleOptionSelect(getSizeInt(size))}
                      >
                        {size}
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

export default InputModesTool;
