import React from 'react';
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
    return useNavbar(DrawingNavbarComponent, false, 'drawing-navbar');
}

export default DrawingNavbar;
