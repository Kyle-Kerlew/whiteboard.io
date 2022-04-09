import React from 'react';
import Nav from 'react-bootstrap/Nav';
import {
  useSelector,
} from 'react-redux';
import useNavbar from './useNavbar';

function BrowsingNavbar () {
  const user = useSelector((state) => state.user.value);
  const BrowserNavComponent = () => <>
    {!user.isLoadingUser &&
      <>
        {user.isAuthenticated ?
          <Nav.Link href='/my-boards'>My Boards</Nav.Link> :
          <>
            <Nav.Link href='/sign-in'>Sign In</Nav.Link>
            <Nav.Link href='/create-account'>Create Account</Nav.Link>
          </>}

      </>}
  </>;

  return useNavbar(BrowserNavComponent, false);
}

export default BrowsingNavbar;
