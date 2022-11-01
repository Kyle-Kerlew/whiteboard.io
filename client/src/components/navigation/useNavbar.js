import React, {
  useMemo,
} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../svg/logo.svg';

function useNavbar (NavigationOptionsComponent, collapse = true) {
  return (
    <>
      {useMemo(() => {
        return (
          <Navbar style={{margin: 'none'}} bg='light' expand={collapse ? 'lg' : undefined} fixed='top'>
            <div
              className='container-xl'>
              <Navbar.Brand className={"align-self-start"} href='/'>
                <img alt='logo' src={logo} />
              </Navbar.Brand>
              <Navbar.Toggle />
              {collapse ?
                <Navbar.Collapse>
                  <NavigationOptionsComponent />
                </Navbar.Collapse> :
                <NavigationOptionsComponent />}
            </div>
          </Navbar>
        );
      }, [
        NavigationOptionsComponent,
        collapse,
      ])}
    </>
  );
}

export default useNavbar;
