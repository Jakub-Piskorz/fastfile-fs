import { Link } from 'react-router-dom'
import toggleNav from '@/scripts/toggle-nav.js'
import logo from '@/images/logo/FastFile-web.png'
import logoDark from '@/images/logo/FastFile-reverse.png'
import profilePic from '@/images/user.svg'
import style from './App.module.scss'
import contextMenuStyle from './ContextMenu/ContextMenu.module.css'
import { useStore } from '@/hooks/store'
import { debounce } from '@/scripts/utils'
import { useEffect, useMemo } from 'react'

const Header = () => {
  const { darkMode, menuState, setMenuState } = useStore()

  // const onSearch = (e: Html)

  const debouncedSearch = useMemo(
    () => debounce(() => console.log('lol'), 500),
    []
  )

  useEffect(() => {
    return () => {
      debouncedSearch.cancel?.() // if you add cancel method from previous example
    }
  }, [debouncedSearch])

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
      `.${contextMenuStyle.contextMenu}`
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
          <input
            type="text"
            placeholder="Search something..."
            onKeyUp={debouncedSearch}
          />
        </div>
      </div>
      <div id={style.right}>
        <img src={profilePic} onClick={clickHandler} />
      </div>
    </header>
  )
}

export default Header
