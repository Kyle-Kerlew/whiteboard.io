import Bubble from '../shared/bubble';
import '../../styles/activeUsers.css';
import React, {useMemo} from 'react';
import _ from 'lodash';
import {useSelector} from "react-redux";

const ActiveUsers = () => {
    const collaborators = useSelector((state) => {
        return state.whiteboard.value.collaborators;
    }, (oldVal, newVal) => {
        return JSON.stringify(oldVal) === JSON.stringify(newVal)
    })
    const colors = [
        '#7CC0EB',
        '#94EB65',
        '#EB4DEB',
        '#EBA23A',
    ];
    const maxCircles = 4;
    const overflow = collaborators.length - maxCircles;

    function getRandomColor() {
        const randomIndex = Math.floor(Math.random() * (colors.length - 1));
        const selectedColor = colors[randomIndex];
        _.remove(colors, (value) => value === selectedColor);
        return selectedColor;
    }

    function getOverflowUsers() {
        if (overflow > 0) {
            return collaborators.slice(collaborators.length - overflow);
        }

        return [];
    }

    const collaboratorInfo = {
        collaborators: overflow > 0 ?
            collaborators.slice(0, collaborators.length - overflow) :
            collaborators,
        overflowUsers: getOverflowUsers(),
    };
    return (
        <div>
            {collaboratorInfo.collaborators.map((user) => <Bubble
                key={user.lastName + user.lastName}
                color={getRandomColor()}
                text={user.firstName.slice(0, 1) + user.lastName.slice(0, 1)}
            />)}
            {collaboratorInfo.overflowUsers.length > 0 && collaboratorInfo.overflowUsers.map((overflowUser) => <div
                className='overflow'
                key={overflowUser.lastName + overflowUser.lastName}
            >{`+ ${overflow} other${overflow > 1 ?
                's' :
                ''}`}</div>)}
        </div>
    )
};

export default ActiveUsers;
