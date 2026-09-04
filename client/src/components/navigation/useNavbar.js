import React, {
  useMemo,
} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../../assets/images/logo.png';

function useNavbar (NavigationOptionsComponent, collapse = true, className) {
  return (
    <>
      {useMemo(() => {
        return (
          <Navbar className={className} style={{margin: 'none'}} bg='light' expand={collapse ? 'lg' : undefined} fixed='top'>
            <div className={'d-flex align-items-center w-100 px-5'}>
              <Navbar.Brand className={"align-self-start m-0"}  href='/'>
                <img alt='logo' src={logo} style={{ height: '4rem', width: 'auto' }} />
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
