import { Link } from 'react-router-dom'
import toggleNav from '@/scripts/toggle-nav.js'
import logo from '@/images/logo/FastFile-web.png'
import logoDark from '@/images/logo/FastFile-reverse.png'
import profilePic from '@/images/user.svg'
import style from './App.module.scss'
import CookieScripts from '../scripts/cookie-scripts'

const Header = (props: any) => {
  const html: HTMLElement | null = document.querySelector('html')
  const changeMode = () => {
    if (!html) return
    if (html.getAttribute('theme') === 'light') {
      props.setDarkMode(true)
      html.setAttribute('theme', 'dark')
      CookieScripts.add('theme', 'dark')
    } else {
      props.setDarkMode(false)
      html.setAttribute('theme', 'light')
      CookieScripts.add('theme', 'light')
    }
  }
  const clickHandler = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (props.menuState === 'profile') {
      props.setMenuState('closed')
      return
    }
    props.setMenuState('profile')
    const x = e.nativeEvent.clientX
    const y = e.nativeEvent.clientY
    const contextMenu: HTMLElement | null = document.querySelector(`.${style.contextMenu}`)
    if (contextMenu === null) {
      console.error(`DOM call for context menu returned null.`)
      return
    }
    contextMenu.style.top = `75px`
    contextMenu.style.left = ``
    contextMenu.style.right = `36px`
  }

  return (
    <header className={style.header} onClick={props.hideMenu}>
      <div id={style.left}>
        <div className={style.hamwrapper}>
          <div className={style.hamburger}></div>
        </div>

        <Link to="/">
          <img
            src={props.darkMode === "dark" ? logoDark : logo}
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
        <img src={profilePic} onClick={clickHandler} />
      </div>
    </header>
  )
}

export default Header
