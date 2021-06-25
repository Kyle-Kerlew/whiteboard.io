import React from 'react';
import {useLocation} from "react-router-dom";
import useNavbar from "./useNavbar";
import Nav from "react-bootstrap/Nav";
import ActiveUsers from "./activeUsers";
import {useSelector} from "react-redux";

function DrawingNavbar() {
    const withDrawingNavbar = () => (
        <ActiveUsers/>
    );
    const {Result} = useNavbar(withDrawingNavbar, 'full-width');
    return Result;
}

function BrowsingNavbar() {
    const user = useSelector(state => state.user.value);
    const withBrowsingNavbar = () => (
        <React.Fragment>
            {user.isAuthenticated ?
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