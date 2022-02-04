import React, {
  useRef,
} from 'react';
import '../../styles/toolbar.css';

const Toolbar = ({
  isMouseDown,
  children,
  position = 'bottom',
}) => {
  const toolbarRef = useRef();

  function getStyle () {
    if (isMouseDown) {
      setTimeout(() => {
        if (toolbarRef.current.style.opacity === '0') {
          toolbarRef.current.style.display = 'none';
        }
      }, 250);
      return {
        animation: 'fadeOutComplete .5s forwards',
        opacity: 0,
      };
    }

    if (toolbarRef.current) {
      toolbarRef.current.style.display = 'flex';
      return {
        animation: 'fadeInFromComplete .5s forwards',
        opacity: 1,
      };
    }
  }

  return (
    <div
      className={[
        'toolbar',
        position,
      ].join(' ')}
      ref={toolbarRef}
      style={getStyle()}
    >
      {children}
    </div>
  );
};

export default Toolbar;
