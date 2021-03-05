import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'
import toggleNav from '@/scripts/toggle-nav.js'
import logo from '@/images/logo/FastFile-web.png'
import logoDark from '@/images/logo/FastFile-reverse.png'
import profilePic from '@/images/trump.png'
import style from './App.module.scss'
import CookieScripts from '../scripts/cookie-scripts'
import API from '../scripts/API'
import { useEffect, useState } from 'react'

const Header = (props) => {
  const html = document.querySelector('html')
  const [darkMode, setDarkMode] = useState(false)
  useEffect(() => {
    document.querySelector(`#${style.switch}`).checked =
      CookieScripts.value('theme') === 'dark' ? false : true
    setDarkMode(html.getAttribute('theme') === 'dark' ? false : true)
  }, [])

  const logout = (e) => {
    API.logout(CookieScripts.value('token')).then((response) => {
      e.preventDefault()
      CookieScripts.add('token', '')
      window.location.href = 'http://fastfile.jakubpiskorz.pl/'
    })
  }
  const changeMode = () => {
    if (html.getAttribute('theme') === 'light') {
      setDarkMode(false)
      html.setAttribute('theme', 'dark')
      CookieScripts.add('theme', 'dark')
    } else {
      setDarkMode(true)
      html.setAttribute('theme', 'light')
      CookieScripts.add('theme', 'light')
    }
  }

  return (
    <header className={style.header} onClick={props.onClick}>
      <div id={style.left}>
        <div className={style.hamwrapper}>
          <div className={style.hamburger}></div>
        </div>

        <Link to="/">
          <img
            src={darkMode === true ? logo : logoDark}
            title="FastFile"
            alt="FastFile"
          />
        </Link>
      </div>
      <div id={style.mid}>
        <div className={style['nav-button']} onClick={toggleNav}>
          <i className={style['nav-icon']}></i>
        </div>
        <div id={style['searchbar']}>
          <input type="text" placeholder="Search something..." />
        </div>
      </div>
      <div id={style.right}>
        <input type="checkbox" id={style.switch} onClick={changeMode} />
        <label htmlFor={style.switch} id={style.label}>
          Toggle
        </label>
        <button id={style.logout} onClick={logout}>
          Logout
        </button>
        <img src={profilePic} />
      </div>
    </header>
  )
}

export default Header
