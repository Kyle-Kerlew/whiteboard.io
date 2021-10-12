import React from 'react';
import '../../styles/button.css';

function Button({onClick, variant = "primary", children}) {

    return (
        <button onClick={onClick} className={"button " + variant}>
            {children}
        </button>
    );
}

export default Button;