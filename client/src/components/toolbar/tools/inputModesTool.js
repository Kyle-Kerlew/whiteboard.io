import {Menu, MenuItem,} from '@mui/material';
import React, {useRef, useState,} from 'react';
import MarkerIcon from '../../../resources/svg/marker-icon.svg';

const InputModesTool = ({
  handlePresentationClick,
  handleMarkerClick,
  anchorEl,
}) => {
  const [
    isPresentationMenuVisible,
    setIsPresentationMenuVisible,
  ] = useState(false);
  const [
    istMarkerMenuVisible,
    setMarkerMenuVisible,
  ] = useState(false);
  const [
    mode,
    setMode,
  ] = useState('Drawing');
  const presentationModeMenuAnchorRef = useRef();
  const markerMenuAnchorRef = useRef();

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

  return (
    <div>
      <Menu
        anchorEl={document.querySelectorAll('.toolbar')[0]} onClose={() => setMarkerMenuVisible(false)}
        open={istMarkerMenuVisible}
      >
        {[
          'Small',
          'Medium',
          'Large',
        ].map((size) => <MenuItem key={size}
          onClick={() => {
            handleMarkerClick(getSizeInt(size));
            setMarkerMenuVisible(false);
          }}
        >{size}</MenuItem>)}
      </Menu>
      <img
        alt='Marker Options'
        onClick={() => setMarkerMenuVisible(true)}
        ref={markerMenuAnchorRef}
        src={MarkerIcon}
      />
    </div>
  );
};

export default InputModesTool;
