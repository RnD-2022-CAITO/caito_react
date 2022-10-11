import { Divider } from '@blueprintjs/core';
import React from 'react';
import CAITOLogo from '../../assets/CAITOLogo.svg'
import {ReactComponent as Logo} from '../../assets/logo.svg';

import './Footer.css';

export const Footer = () => {
  return (
    <footer>
        <Divider style={{margin:'0 20px'}}/>
        <div className='footer'>
            <div className='footer-left'>
                <Logo className='brand-logo'/>
                <p>© 2022 enlight. All rights reserved.</p>
            </div>
            <div className='footer-right'>
                <p>Powered by <a href='https://www.caito.ai'>CAITO</a></p>
                <img className='caito-logo' src={CAITOLogo} alt='CAITO logo'/>
            </div>
        </div>
    </footer>
  )
}
