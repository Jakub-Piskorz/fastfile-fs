import React from 'react'
import toggleNav from '@/scripts/toggle-nav.js'
import logo from '@/images/logo.png'
import profilePic from '@/images/trump.png'

const Header = (props) => {
  return (
    <header>
      <div id="left">
        <div className="hamwrapper">
          <div className="hamburger"></div>
        </div>

        <a href="/">
          <img src={logo} title="FastFile" alt="FastFile" />
        </a>
      </div>
      <div id="mid">
        <div className="nav-button" onClick={toggleNav}>
          <i className="nav-icon"></i>
        </div>
        <div id="text-wrapper">
          <input type="text" placeholder="Search something..." />
        </div>
      </div>
      <img id="right" src={profilePic} />
    </header>
  )
}

export default Header
