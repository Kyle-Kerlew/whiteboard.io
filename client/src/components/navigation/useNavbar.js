import React from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

const useNavbar = NavigationOptionsComponent => {
    const Result = () => (
        <Navbar bg="light" expand="lg" className='fixed-top'>
            <Navbar.Brand href="/">Whiteboard IO</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <NavigationOptionsComponent/>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );

    return {Result}
};

export default useNavbar;