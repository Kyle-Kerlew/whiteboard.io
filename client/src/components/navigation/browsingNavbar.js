import Nav from 'react-bootstrap/Nav';
import {
  useSelector,
} from 'react-redux';
import useNavbar from './useNavbar';

function BrowsingNavbar() {
  const user = useSelector((state) => state.user.value);
  const BrowserNavComponent = () => <>
    <div className={'d-flex'}>
      <Nav.Link href='/my-boards'>Features</Nav.Link>
      <Nav.Link href='/my-boards'>How It Works</Nav.Link>
    </div>
    {!user.isLoadingUser &&
      <div className={'d-inline-flex'} style={{marginLeft: 'auto'}}>
        {user.isAuthenticated ?
          <Nav.Link href='/my-boards'>My Boards</Nav.Link> :
          <>
            <Nav.Link href='/sign-in'>Sign In</Nav.Link>
            <Nav.Link href='/create-account'>Create Account</Nav.Link>
          </>}

      </div>}
  </>;

  return useNavbar(BrowserNavComponent, false);
}

export default BrowsingNavbar;
