import Bubble from "../shared/bubble";
import "../../styles/activeUsers.css";
import React from 'react';
import {useSelector} from 'react-redux';
import _ from 'lodash';

function ActiveUsers() {

    const collaborators = useSelector(state => state.collaborators.value);
    console.log("Collaborators received by the navigaation bar", collaborators);
    const colors = ['#7CC0EB', '#94EB65', '#EB4DEB', '#EBA23A'];
    const maxCircles = 4;
    const overflow = collaborators.length - maxCircles;

    function getRandomColor() {
        const randomIndex = Math.floor(Math.random() * (colors.length - 1));
        const selectedColor = colors[randomIndex];
        _.remove(colors, val => val === selectedColor);
        return selectedColor;
    }

    return (
        <div className='users-container'>
            {(overflow > 0 ? collaborators.slice(collaborators.length - overflow, collaborators.length - 1) : collaborators).map(user => (
                <Bubble text={user.firstName.slice(0, 1) + user.lastName.slice(0, 1)} color={getRandomColor()}/>
            ))}
            {overflow > 0 &&
            <div className='overflow'>{`+ ${overflow} other${overflow > 1 ? 's' : ''}`}</div>
            }
        </div>
    )
}

export default ActiveUsers;