import Bubble from "../shared/bubble";
import "../../styles/activeUsers.css";
import React, {useState} from 'react';
import _ from 'lodash';

function ActiveUsers() {
    //todo: socket for keeping track of users
    const [activeUsers, setActiveUsers] = useState(["KK", "TK", "ET", "PP", "SS", "TT", "LE"]);
    const colors = ['#7CC0EB', '#94EB65', '#EB4DEB', '#EBA23A'];
    const maxCircles = 4;
    const overflow = activeUsers.length - maxCircles;
    function getRandomColor() {
        const randomIndex = Math.floor(Math.random() * (colors.length - 1));
        const selectedColor = colors[randomIndex];
        _.remove(colors, val => val === selectedColor);
        return selectedColor;
    }

    function addPerson(person) {

    }

    function removePerson(person) {

    }


    return (
        <div className='users-container'>
            {activeUsers.splice(overflow, activeUsers.length - 1).map(user => (
                <Bubble text={user} color={getRandomColor()}/>
            ))}
            {overflow > 0 &&
            <div className='overflow'>{`+ ${overflow} other${overflow > 1 ? 's' : ''}`}</div>
            }
        </div>
    )
}

export default ActiveUsers;