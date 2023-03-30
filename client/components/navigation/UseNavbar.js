import React, {
} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import logo from './../../public/resources/svg/logo.svg';
import Image from "next/image";

function useNavbar (NavigationOptionsComponent, collapse = true) {
  return (
    <>
        return (
          <Navbar style={{margin: 'none'}} bg='light' expand={collapse ? 'lg' : undefined} fixed='top'>
            <div
              className='container-xl'>
              <Navbar.Brand className={"align-self-start m-0"} href='/'>
                <Image priority={true} alt='logo' src={logo} />
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
    </>
  );
}

export default useNavbar;
