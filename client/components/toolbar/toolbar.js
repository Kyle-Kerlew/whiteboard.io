import React, {
    useEffect,
    useRef,
} from 'react';
import style from './../../styles/Toolbar.module.css';

const Toolbar = ({
                     isMouseDown,
                     children,
                     position = 'bottom',
                 }) => {
    const toolbarRef = useRef();

    useEffect(() => {
        if (isMouseDown) {
            setTimeout(() => {
                if (toolbarRef.current.style.opacity === '0') {
                    toolbarRef.current.style.display = 'none';
                }
            }, 250);
        }
    }, [isMouseDown])
    function getStyle() {
        if (isMouseDown) {
            return 'fadeOutComplete';
        }

        if (toolbarRef.current) {
            toolbarRef.current.style.display = 'flex';
            return 'fadeInFromComplete'
        }
    }

    function getOpacity() {
        if (isMouseDown) {
            return {opacity: 0}
        }
        if (toolbarRef.current) {
            return {opacity: 1}
        }
    }
    return (
        <div
            className={[
                style.toolbar,
                style[position],
                style[getStyle()]
            ].join(' ')}
            ref={toolbarRef}
            style={getOpacity()}
        >
            {children}
        </div>
    );
};

export default Toolbar;
