import React from 'react';
import style from '../../styles/Button.module.css';
import cx from "classnames";
function Button({onClick, variant = "primary", children, grow}) {

    return (
        <button onClick={onClick} className={cx(style.button, style[variant], grow)}>
            {children}
        </button>
    );
}

export default Button;
