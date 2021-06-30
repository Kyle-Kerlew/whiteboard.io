import {useSelector} from "react-redux";
import React from "react";
import Nav from "react-bootstrap/Nav";
import useNavbar from "./useNavbar";

function BrowsingNavbar() {

    const user = useSelector(state => state.user.value);
    const BrowserNavComponent = () => (
        <React.Fragment>
            {!user.isLoadingUser &&
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
            }
        </React.Fragment>
    )
    return useNavbar(BrowserNavComponent);

}

export default BrowsingNavbar;