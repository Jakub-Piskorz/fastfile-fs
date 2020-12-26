import toggleNav from '@/scripts/toggle-nav.js'
import logo from '@/images/logo.png'
import profilePic from '@/images/trump.png'
import style from '@/style.module.scss'
import CookieScripts from '../scripts/cookie-scripts'
import API from '../scripts/API'

const Header = (props) => {
  const logout = (e) => {
    API.logout(CookieScripts.value('token')).then((response) => {
      e.preventDefault()
      CookieScripts.add('token', '')
      window.location.href = '/lp'
    })
  }
  return (
    <header className={style.header}>
      <div id={style.left}>
        <div className={style.hamwrapper}>
          <div className={style.hamburger}></div>
        </div>

        <a href="/">
          <img src={logo} title="FastFile" alt="FastFile" />
        </a>
      </div>
      <div id={style.mid}>
        <div className={style['nav-button']} onClick={toggleNav}>
          <i className={style['nav-icon']}></i>
        </div>
        <div id={style['text-wrapper']}>
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
