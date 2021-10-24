import React from 'react';
import '../../styles/button.css';

function Button({onClick, variant = "primary", children, grow}) {

    function getClasses() {
        return grow ? "button " + variant + ' ' + 'grow' : "button " + variant;
    }

    return (
        <button onClick={onClick} className={getClasses()}>
            {children}
        </button>
    );
}

export default Button;