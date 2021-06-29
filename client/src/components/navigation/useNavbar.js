import React from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

function useNavbar(NavigationOptionsComponent) {
    return (
        <Navbar expand="md" bg="light" fixed="top">
            <Navbar.Brand href="/">Whiteboard IO</Navbar.Brand>
            <Navbar.Toggle/>
            <Navbar.Collapse>
                <NavigationOptionsComponent/>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default useNavbar;