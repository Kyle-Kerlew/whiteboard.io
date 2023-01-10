import React from 'react';
import style from './../../styles/ImageTextBox.module.css';

function ImageTextBox() {
    return (
        <div className={style.imageTextBox}>
            {children}
        </div>
    )
}

export default ImageTextBox;
