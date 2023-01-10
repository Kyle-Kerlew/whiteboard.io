import React from 'react';
import style from "../../styles/Switch.module.css";

function Switch() {

    return (
        <label className={style.switch}>
            <input type="checkbox"/>
            <div className={`${style.slider} ${style.round}`}/>
        </label>
    )
}

export default Switch;
