import React from 'react';
import {
    connect, useSelector,
} from 'react-redux';
import ActiveUsers from './activeUsers';
import useNavbar from './useNavbar';
import EditableTitle from "./EditableTitle";

function DrawingNavbar() {
    const DrawingNavbarComponent = () => {
        return (
            <>
                <EditableTitle/>
                <ActiveUsers/>
            </>
        )
    };
    return useNavbar(DrawingNavbarComponent, false);
}

const mapStateToProps = (state) => state.whiteboard.value;
export default connect(mapStateToProps)(React.memo(DrawingNavbar));
