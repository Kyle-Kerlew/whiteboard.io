import React from 'react';
import '../../styles/footer.css';
import logo from '../svg/logo.svg';

const Footer = () => {
  return (
    <div className='footer'>
      <div className='logo'>
        <img alt='logo' src={logo} />
        <p>Simplify workflows for remote teams</p>
      </div>
      <div className='navigation'>
        <span> Created by by Kyle Kerlew. Learn more at <a href="https://kylekerlew.com"> kylekerlew.com </a>
        </span>
      </div>
    </div>
  );
};

export default Footer;
