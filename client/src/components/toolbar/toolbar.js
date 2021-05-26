import React, {useEffect, useRef} from 'react';
import '../../styles/toolbar.css';

const Toolbar = ({mouseDown, children, position = 'bottom'}) => {
    const toolbarRef = useRef();

    useEffect(() => {
        if (mouseDown && toolbarRef.current.style.opacity === "0") {
            setTimeout(() => {
                if (toolbarRef.current) {
                    toolbarRef.current.style.display = "none";
                }
            }, 500);
        } else {
            toolbarRef.current.style.display = "flex";
        }

    }, [mouseDown]);

    function getStyle() {
        return mouseDown ? {opacity: 0, animation: 'fadeOutComplete .5s forwards'} : {
            opacity: 1,
            animation: 'fadeInFromComplete .5s forwards'
        };
    }

    return (
        <div ref={toolbarRef}
             style={getStyle()}
             className={['toolbar', position].join(' ')}
        >
            {children}
        </div>
    )
}

export default Toolbar;