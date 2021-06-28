import React from 'react';
import {useLocation} from "react-router-dom";
import DrawingNavbar from "./drawingNavbar";
import BrowsingNavbar from "./browsingNavbar";


function NavBar() {
    const location = useLocation();
    const Result = location.pathname.includes('/boards/') ? DrawingNavbar : BrowsingNavbar;

    return (
        <Result/>
    )
}

export default NavBar;