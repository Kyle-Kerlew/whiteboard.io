import React from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import "../../styles/navBar.css"

function useNavbar(NavigationOptionsComponent, style) {
    return (
        <Navbar bg="light" expand="lg" className={'fixed-top' + ` ${style}`}>
            <Navbar.Brand href="/">Whiteboard IO</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <NavigationOptionsComponent/>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default useNavbar;