import React from "react";
import ActiveUsers from "./activeUsers";
import useNavbar from "./useNavbar";
import {connect} from "react-redux";
import Navbar from 'react-bootstrap/Navbar';

function DrawingNavbar(props) {
    const DrawingNavbarComponent = () => (
        <React.Fragment>
            <Navbar.Text><ActiveUsers collaborators={props?.collaborators || []}/></Navbar.Text>
        </React.Fragment>
    );
    return useNavbar(DrawingNavbarComponent, false);
}

const mapStateToProps = state => (state.whiteboard.value);
export default connect(mapStateToProps)(React.memo(DrawingNavbar));