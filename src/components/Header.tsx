import { Link } from 'react-router-dom'
import toggleNav from '@/scripts/toggle-nav.js'
import logo from '@/images/logo/FastFile-web.png'
import logoDark from '@/images/logo/FastFile-reverse.png'
import profilePic from '@/images/user.svg'
import style from './App.module.scss'
import { useStore } from '@/hooks/store'

const Header = () => {
  const { darkMode, menuState, setMenuState } = useStore()

  const clickHandler = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (menuState === 'profile') {
      setMenuState('closed')
      return
    }
    setMenuState('profile')
    const x = e.nativeEvent.clientX
    const y = e.nativeEvent.clientY
    const contextMenu: HTMLElement | null = document.querySelector(
      `.${style.contextMenu}`
    )
    if (contextMenu === null) {
      console.error(`DOM call for context menu returned null.`)
      return
    }
    contextMenu.style.top = `75px`
    contextMenu.style.left = ``
    contextMenu.style.right = `36px`
  }

  return (
    <header className={style.header} onClick={() => setMenuState('closed')}>
      <div id={style.left}>
        <div className={style.hamwrapper}>
          <div className={style.hamburger}></div>
        </div>

        <Link to="/">
          <img
            src={darkMode ? logoDark : logo}
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
