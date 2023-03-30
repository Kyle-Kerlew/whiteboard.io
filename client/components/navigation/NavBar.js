import React from 'react';
import BrowsingNavbar from './browsingNavbar';
import DrawingNavbar from './drawingNavbar';
import {useRouter} from "next/router";

const NavBar = () => {
  const location = useRouter();
  const Result = location.asPath.includes('/boards/') ? DrawingNavbar : BrowsingNavbar;

  return (
    <Result />
  );
};

export default NavBar;
