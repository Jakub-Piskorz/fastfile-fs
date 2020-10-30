import React from 'react'
import logo from '@/images/logo.png'

const Header = props => {

  return <header>
    <div id="left">
      <div className="hamburger"></div>
      <a href="/h"><img src={logo} title="FastFile" alt="FastFile" /></a>
    </div>
    
  </header>
}

export default Header