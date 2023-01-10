import React from 'react';
import LoadIcon from './../../public/resources/svg/loading.svg';
import style from './../../styles/Load.module.css';
import Image from "next/image";

const Loading = () => {
  return (
    <div className={style.loadingIcon}>
      <Image priority={true} alt='Loading' src={LoadIcon} />
    </div>
  );
};

export default Loading;
