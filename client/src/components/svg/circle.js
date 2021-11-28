import React from 'react';
import CircleIcon from '../../resources/svg/circle-icon.svg';

const Circle = ({size, onClick, color}) => {
    return (
        <svg height={size} width={size} xmlns="http://www.w3.org/2000/svg">
            <circle cx={size/2} cy={size/2} r=".1" stroke={color} strokeWidth={size} fill={color}/>
        </svg>
    )
}

export default Circle;