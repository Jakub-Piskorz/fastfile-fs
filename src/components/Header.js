import React from 'react'
import logo from '@/images/logo.png'
import trump from '@/images/trump.png'

const Header = (props) => {
  const toggleNav = (event) => {
    document.querySelector('.sidebar').classList.toggle('show')
    document.querySelector('.sidebar-mask').classList.toggle('hidden')
    event.target.classList.toggle('show')
  }

  return (
    <header>
      <div id="left">
        <div className="hamwrapper" onClick={toggleNav}>
          <div className="hamburger"></div>
        </div>

        <a href="/">
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
