import React from 'react';
import LoadIcon from '../../resources/svg/loading.svg';
import '../../styles/load.css';

const Loading = () => {
  return (
    <div className='loading-icon'>
      <img alt='Loading' src={LoadIcon} />
    </div>
  );
};

export default Loading;
