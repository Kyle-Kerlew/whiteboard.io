import React from 'react';
import style from './../../styles/Footer.module.css';
import logo from './../../public/resources/svg/logo.svg';
import Image from "next/image";

const Footer = () => {
  return (
    <div className={style.footer}>
      <div className={style.logo}>
        <Image height={100} width={100} alt='logo' src={logo} />
        <p>Simplify workflows for remote teams</p>
      </div>
      <div className={style.navigation}>
        <ul>
          <li>
            <a href='/test'>Github</a>
          </li>
          <li>
            <a href='/test'>Privacy Policy</a>
          </li>
          <li>
            <a href='/test'>Terms of Service</a>
          </li>
          <li>
            <a href='/test'>Report a Bug</a>
          </li>
          <li>
            <a href='/test'>FAQ</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default React.memo(Footer);
