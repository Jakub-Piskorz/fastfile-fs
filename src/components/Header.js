import React from 'react'
import logo from '@/images/logo.png'
import trump from '@/images/trump.png'

const Header = (props) => {
  return (
    <header>
      <div id="left">
        <div className="hamburger"></div>
        <a href="/h">
          <img src={logo} title="FastFile" alt="FastFile" />
        </a>
      </div>
      <div id="mid">
        <input type="text" placeholder="Search something..." />
      </div>
      <img id="right" src={trump} />
    </header>
  )
}

export default Header
