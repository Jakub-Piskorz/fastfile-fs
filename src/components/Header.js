import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'
import toggleNav from '@/scripts/toggle-nav.js'
import logo from '@/images/logo/FastFile-web.png'
import profilePic from '@/images/trump.png'
import style from './App.module.scss'
import CookieScripts from '../scripts/cookie-scripts'
import API from '../scripts/API'

const Header = (props) => {
  const logout = (e) => {
    API.logout(CookieScripts.value('token')).then((response) => {
      e.preventDefault()
      CookieScripts.add('token', '')
      window.location.href = 'http://fastfile.jakubpiskorz.pl/'
    })
  }

  return (
    <header className={style.header} onClick={props.onClick}>
      <div id={style.left}>
        <div className={style.hamwrapper}>
          <div className={style.hamburger}></div>
        </div>

        <Link to="/">
          <img src={logo} title="FastFile" alt="FastFile" />
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
        <button id={style.logout} onClick={logout}>
          Logout
        </button>
        <img src={profilePic} />
      </div>
    </header>
  )
}

export default Header
