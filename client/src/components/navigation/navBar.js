import React from 'react';
import {
  useLocation,
} from 'react-router-dom';
import BrowsingNavbar from './browsingNavbar';
import DrawingNavbar from './drawingNavbar';

const NavBar = () => {
  const location = useLocation();
  const Result = location.pathname.includes('/boards/') ? DrawingNavbar : BrowsingNavbar;

  return (
    <Result />
  );
};

export default NavBar;
