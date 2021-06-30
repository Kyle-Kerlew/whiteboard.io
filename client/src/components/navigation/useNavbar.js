import React from "react";
import Navbar from 'react-bootstrap/Navbar';

function useNavbar(NavigationOptionsComponent, collapse = true) {
    return (
        <Navbar expand={collapse ? 'lg' : undefined} bg="light" fixed="top">
            <Navbar.Brand href="/">Whiteboard IO</Navbar.Brand>
            <Navbar.Toggle/>
            {collapse
                ?
                <Navbar.Collapse>
                    <NavigationOptionsComponent/>
                </Navbar.Collapse>
                :
                <NavigationOptionsComponent/>
            }
        </Navbar>
    )
}

export default useNavbar;