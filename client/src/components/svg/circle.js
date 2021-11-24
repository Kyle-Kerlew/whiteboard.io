import React from 'react';
import CircleIcon from '../../resources/svg/circle-icon.svg';

const Circle = ({size, onClick, color}) => {
    return (
        <div>
            <img src={CircleIcon}/>
        </div>
    )
}

export default Circle;