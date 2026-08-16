import { Link, useLocation } from 'react-router-dom'
import useToggleNav from '@/scripts/toggle-nav.js'
import logo from '@/images/logo/FastFile-web.png'
import logoDark from '@/images/logo/FastFile-reverse.png'
import profilePic from '@/images/user.svg'
import style from './Header.module.css'
import contextMenuStyle from '../ContextMenu/ContextMenu.module.css'
import { useStore } from '@/hooks/store'
import React, { useEffect, useMemo, useState } from 'react'
import Api from '@/api'
import { routes, useCurrentRoute } from '@/router/router'
import MenuState from '@/types/MenuStateEnum'
import { useDebounce } from '@/scripts/utils'
import { useQuery, useQueryClient } from '@tanstack/react-query'

const Header = () => {
  const { darkMode, setDarkMode, menuState, setMenuState, setSearchedFiles, setContextMenuPosition } =
    useStore()
  const toggleNav = useToggleNav()
  const queryClient = useQueryClient()
  const location = useLocation()
  const currentRoute = useCurrentRoute()
  const isSearchDisabled = useMemo(() =>
    location.pathname.includes('/download/') || currentRoute !== routes.app, [location.pathname, currentRoute])
  const [inputValue, setInputValue] = useState<string>('')
  const debouncedInputValue = useDebounce(inputValue)

  useEffect(() => {
    const html = document.querySelector('html')
    const isDark = html!.getAttribute('theme') === 'dark'
    setDarkMode(isDark)
  }, [])

  // Automatic search files on input change
  useEffect(() => {
    if (inputValue === debouncedInputValue) {
      if (inputValue === '' || isSearchDisabled) {
        setSearchedFiles(null)
        if (inputValue !== '') setInputValue('')
        queryClient.invalidateQueries({ queryKey: ['files'] })
      } else {
        queryClient.invalidateQueries({ queryKey: ['files', 'search'] })
      }
    }
  }, [isSearchDisabled, inputValue, debouncedInputValue])

  const getSearchedFiles = async (searchQuery: string, signal?: AbortSignal) => {
    if (searchQuery.length === 0) return null
    const response = await Api.api.searchFiles({
      fileName: searchQuery,
      directory: location.pathname
    }, { signal })
    if (response.status !== 200) {
      throw new Error('Couldn\'t search file!')
    }
    return response.data
  }

  const searchFiles = async (signal?: AbortSignal) => {
    const searchedFiles = await getSearchedFiles(inputValue, signal)
    if (searchedFiles) setSearchedFiles(searchedFiles)
    return searchedFiles
  }

  useQuery({
    queryKey: ['files', 'search'],
    queryFn: ({ signal }) => searchFiles(signal),
    enabled: inputValue === debouncedInputValue && inputValue !== ''
  })

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
    setContextMenuPosition({
      top: 75,
      right: 0,
      width: 300
    })
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
        <div className={style.navButton} onClick={() => toggleNav()}>
          <i className={style.navIcon}></i>
        </div>
        <div id={style.searchbar}>
          <input
            type="text"
            placeholder="Search something..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
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
