import { Link, useLocation } from 'react-router-dom'
import useToggleNav from '@/scripts/toggle-nav.js'
import logo from '@/images/logo/FastFile-web.png'
import logoDark from '@/images/logo/FastFile-reverse.png'
import profilePic from '@/images/user.svg'
import style from './Header.module.css'
import contextMenuStyle from '../ContextMenu/ContextMenu.module.css'
import { useStore } from '@/hooks/store'
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react'
import API from '@/scripts/API'
import { routes, useCurrentRoute } from '@/router/router'
import MenuState from '@/types/MenuStateEnum'

const Header = () => {
  const { darkMode, menuState, setMenuState, setSearchedFiles } =
    useStore()
  const toggleNav = useToggleNav()
  const location = useLocation()
  const currentRoute = useCurrentRoute()
  const isSearchDisabled = useMemo(() =>
    location.pathname.includes('/download/') || currentRoute !== routes.app, [location.pathname, currentRoute])
  const [inputValue, setInputValue] = useState<string>('')

  useEffect(() => {
    if (isSearchDisabled) {
      setInputValue('')
      setSearchedFiles(null)
    }
  }, [isSearchDisabled])

  const onDebouncedSearch = useMemo(
    () =>
      (() => {
        let timeout: number
        let controller: AbortController
        return (e: ChangeEvent) => {
          const input = e.target as HTMLInputElement
          setInputValue(input.value)
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
        <div className={style.navButton} onClick={toggleNav}>
          <i className={style.navIcon}></i>
        </div>
        <div id={style.searchbar}>
          <input
            type="text"
            placeholder="Search something..."
            value={inputValue}
            onChange={onDebouncedSearch}
            disabled={isSearchDisabled}
            className={isSearchDisabled ? style.disabled : ''}
          />
        </div>
      </div>
      <div id={style.right}>
        <img src={profilePic} onClick={clickHandler} alt="Profile" />
      </div>
    </header>
  )
}

export default Header
