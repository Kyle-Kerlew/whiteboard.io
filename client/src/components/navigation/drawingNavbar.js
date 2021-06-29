import React from "react";
import ActiveUsers from "./activeUsers";
import useNavbar from "./useNavbar";
import {connect} from "react-redux";
import Navbar from 'react-bootstrap/Navbar';
import Nav from "react-bootstrap/Nav";

function DrawingNavbar(props) {
    //todo: memoize?
    const DrawingNavbarComponent = () => (
        <React.Fragment>
            <Nav className='mr-auto'>
                <Navbar.Text><h2>{props?.title}</h2></Navbar.Text>
            </Nav>
            <Navbar.Text><ActiveUsers collaborators={props?.collaborators || []}/></Navbar.Text>
        </React.Fragment>
    );
    return useNavbar(DrawingNavbarComponent, false);
}

const mapStateToProps = state => (state.whiteboard.value);
export default connect(mapStateToProps)(DrawingNavbar);