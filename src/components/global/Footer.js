import { Divider } from '@blueprintjs/core'
import React from 'react'
import {ReactComponent as Logo} from '../../assets/logo.svg';
import './Footer.css'

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
                <a href='#'>Terms of Service</a>
                <a href='#'>Privacy Policy</a>
                <a href='#'>Contact Us</a>
            </div>
        </div>
    </footer>
  )
}
