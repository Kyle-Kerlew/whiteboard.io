import React from 'react';
import LoadIcon from '../../resources/svg/loading.svg';
import '../../styles/load.css';

const Loading = () => {
  return (
    <div className="background">

      <div className='loading-icon'>
        <img alt='Loading' src={LoadIcon} />
      </div>
    </div>
  );
};

export default Loading;
