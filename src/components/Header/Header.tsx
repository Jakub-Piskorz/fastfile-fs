import { Link } from 'react-router-dom'
import toggleNav from '@/scripts/toggle-nav.js'
import logo from '@/images/logo/FastFile-web.png'
import logoDark from '@/images/logo/FastFile-reverse.png'
import profilePic from '@/images/user.svg'
import style from './Header.module.scss'
import contextMenuStyle from '../ContextMenu/ContextMenu.module.css'
import { MenuState, useStore } from '@/hooks/store'
import { useMemo } from 'react'
import API from '@/scripts/API'

const Header = () => {
  const { darkMode, menuState, setMenuState, setSearchedFiles, files } =
    useStore()

  const onDebouncedSearch = useMemo(
    () =>
      (() => {
        let timeout: number
        let controller: AbortController
        return (e: React.KeyboardEvent<HTMLInputElement>) => {
          const input = e.target as HTMLInputElement
          if (timeout) {
            clearTimeout(timeout)
            controller.abort()
          }
          controller = new AbortController()
          timeout = setTimeout(() => {
            if (input.value) {
              API.search(input.value, '', controller)
                .then((res) => res.json())
                .then((searchedFiles) => setSearchedFiles(searchedFiles))
            } else {
              setSearchedFiles(null)
            }
          }, 300)
        }
      })(),
    []
  )

  const clickHandler = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (menuState === MenuState.profile) {
      setMenuState(MenuState.closed)
      return
    }
    setMenuState(MenuState.profile)
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
    <header
      className={style.header}
      onClick={() => setMenuState(MenuState.closed)}
    >
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
            onKeyUp={onDebouncedSearch}
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
