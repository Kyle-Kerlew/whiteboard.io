import Bubble from "../shared/bubble";
import "../../styles/activeUsers.css";
import React from 'react';
import _ from 'lodash';
import {useSelector} from "react-redux";

function ActiveUsers({collaborators}) {
    const colors = ['#7CC0EB', '#94EB65', '#EB4DEB', '#EBA23A'];
    const maxCircles = 4;
    const overflow = collaborators.length - maxCircles;

    function getRandomColor() {
        const randomIndex = Math.floor(Math.random() * (colors.length - 1));
        const selectedColor = colors[randomIndex];
        _.remove(colors, val => val === selectedColor);
        return selectedColor;
    }

    function getOverflowUsers() {
        if (overflow > 0) {
            return collaborators.slice(collaborators.length - overflow);
        }
        return [];
    }

    const collaboratorInfo = {
        collaborators: overflow > 0 ? collaborators.slice(0, collaborators.length - overflow) : collaborators,
        overflowUsers: getOverflowUsers(),
    }

    console.log("collaborators", collaborators);
    return (
        <div className='users-container'>
            {collaboratorInfo.collaborators.map(user => (
                <Bubble text={user.firstName.slice(0, 1) + user.lastName.slice(0, 1)} color={getRandomColor()}/>
            ))}
            {collaboratorInfo.overflowUsers.length > 0 && collaboratorInfo.overflowUsers.map(overflowUser => (
                <div key ={overflowUser.firstName} className='overflow'>{`+ ${overflow} other${overflow > 1 ? 's' : ''}`}</div>
            ))}
        </div>
    )
}

export default ActiveUsers;