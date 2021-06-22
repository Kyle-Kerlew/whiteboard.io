import React, {createContext, useContext, useState} from 'react';
import {useLocation} from "react-router-dom";
import useNavbar from "./useNavbar";
import Nav from "react-bootstrap/Nav";
import Bubble from "../shared/bubble";
import UserContext from "../context/userContext";

function DrawingNavbar() {
    //todo: get context of how many people are working on this page
    const withDrawingNavbar = () => (
        <div className='collaborators-container'>
            <Bubble text={'test'}/>
        </div>
    );

    const {Result} = useNavbar(withDrawingNavbar);
    return Result;
}

function BrowsingNavbar() {
    const {user, checkAuthentication} = useContext(UserContext);

    checkAuthentication();

    const withBrowsingNavbar = () => (
        <React.Fragment>
            {user.authenticated ?
                <Nav.Link href="/my-boards">My Boards</Nav.Link>
                :
                <React.Fragment>
                    <Nav.Link href="/sign-in">Sign In</Nav.Link>
                    <Nav.Link href="/create-account">Create Account</Nav.Link>
                </React.Fragment>
            }

        </React.Fragment>
    );

    const {Result} = useNavbar(withBrowsingNavbar);
    return Result;
}

function NavBar() {

    const location = useLocation();

    const Result = location.pathname.includes('/boards/') ? DrawingNavbar() : BrowsingNavbar();

    return (
        <Result/>
    )
}

export default NavBar;