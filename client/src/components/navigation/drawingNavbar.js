import React from "react";
import ActiveUsers from "./activeUsers";
import useNavbar from "./useNavbar";
import {connect} from "react-redux";

function DrawingNavbar(props) {
    console.log("props", props)
    const DrawingNavbarComponent = () => (
        <div className='toolbar-container'>
            <h2>{props?.title || "Testing"}</h2>
            <ActiveUsers collaborators={props?.collaborators || []}/>
        </div>
    );
    return useNavbar(DrawingNavbarComponent, 'full-width');
}

const mapStateToProps = state => (state.whiteboard.value);
export default connect(mapStateToProps)(DrawingNavbar);