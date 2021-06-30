import React from "react";
import ActiveUsers from "./activeUsers";
import useNavbar from "./useNavbar";
import {connect} from "react-redux";
import Navbar from 'react-bootstrap/Navbar';
import Nav from "react-bootstrap/Nav";
import {NavDropdown} from "react-bootstrap";

function DrawingNavbar(props) {
    //todo: memoize?
    const DrawingNavbarComponent = () => (
        <React.Fragment>
            <Nav className='mr-auto' style={{alignItems: 'center'}}>
                <Navbar.Text><h2>{props?.title}</h2></Navbar.Text>
                <NavDropdown title="Dropdown" id="options">
                    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                    <NavDropdown.Divider/>
                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                </NavDropdown>
            </Nav>
            <Navbar.Text><ActiveUsers collaborators={props?.collaborators || []}/></Navbar.Text>
        </React.Fragment>
    );
    return useNavbar(DrawingNavbarComponent, false);
}

const mapStateToProps = state => (state.whiteboard.value);
export default connect(mapStateToProps)(DrawingNavbar);