import React, {useRef} from 'react';
import '../../styles/toolbar.css';

const Toolbar = ({mouseDown, children, position = 'bottom'}) => {
    const toolbarRef = useRef();

    function getStyle() {
        if (mouseDown) {
            setTimeout(() => {
                if (toolbarRef.current.style.opacity === "0") {
                    toolbarRef.current.style.display = "none";
                }
            }, 250);
            return {opacity: 0, animation: 'fadeOutComplete .5s forwards'};
        }
        if (toolbarRef.current) {
            toolbarRef.current.style.display = "flex";
            return {opacity: 1, animation: 'fadeInFromComplete .5s forwards'};
        }
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