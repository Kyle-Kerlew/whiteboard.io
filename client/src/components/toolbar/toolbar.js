import React, {useEffect, useRef, useState} from 'react';
import '../../styles/toolbar.css';

const Toolbar = ({mouseDown, children, position = 'bottom'}) => {
    const toolbarRef = useRef();
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        toolbarRef.current.style.display = !isVisible ? "none" : "flex";

    }, []);

    function getStyle() {
        if (mouseDown) {
            setTimeout(() => setIsVisible(false), 500);
            return {opacity: 0, animation: 'fadeOutComplete .5s forwards'};
        } else {
            setTimeout(() => setIsVisible(true), 500);
            return {
                opacity: 1,
                animation: 'fadeInFromComplete .5s forwards'
            };
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