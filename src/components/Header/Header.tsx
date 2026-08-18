import { Link, useLocation } from 'react-router-dom'
import useToggleNav from '@/scripts/toggle-nav.js'
import logo from '@/images/logo/FastFile-web.png'
import logoDark from '@/images/logo/FastFile-reverse.png'
import profilePic from '@/images/user.svg'
import style from './Header.module.css'
import contextMenuStyle from '../ContextMenu/ContextMenu.module.css'
import { useStore } from '@/store/store'
import React, { useEffect, useMemo, useState } from 'react'
import Api from '@/api'
import { Routes, RouteValue, useCurrentRoute } from '@/router/router'
import MenuState from '@/types/MenuStateEnum'
import { useDebounce } from '@/scripts/utils'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { FileScreen, useFileStore } from '@/pages/App/Files/filesStore'

const Header = () => {
  const { darkMode, setDarkMode, menuState, setMenuState, setContextMenuPosition } =
    useStore()
  const setFileQuery = useFileStore(s => s.setFileQuery)
  const toggleNav = useToggleNav()
  const queryClient = useQueryClient()
  const location = useLocation()
  const currentRoute = useCurrentRoute()
  const isSearchDisabled = useMemo(() =>
    location.pathname.includes('/download/') || currentRoute !== Routes.app, [location.pathname, currentRoute])
  const [inputValue, setInputValue] = useState<string>('')
  const debouncedInputValue = useDebounce(inputValue)

  useEffect(() => {
    const html = document.querySelector('html')
    const isDark = html!.getAttribute('theme') === 'dark'
    setDarkMode(isDark)
  }, [])

  // Automatic fileQuery setting.
  // It is mainly used for fetching files from correct endpoint.
  useEffect(() => {

    // Search takes priority over route.
    if (debouncedInputValue.length > 0) {
      setFileQuery({
        screen: FileScreen.search,
        search: debouncedInputValue
      })
      return
    }

    const routeToFileScreen = {
      [Routes.app]: FileScreen.files,
      [Routes.shared]: FileScreen.filesIShare,
      [Routes.sharedWithMe]: FileScreen.filesSharedWithMe,
      [Routes.download]: FileScreen.link
    } as Partial<Record<RouteValue, FileScreen>>

    setFileQuery({
      screen: routeToFileScreen[currentRoute] ?? FileScreen.files,
      search: undefined
    })
  }, [currentRoute, debouncedInputValue])


// Automatic search files on input change
  useEffect(() => {
    if (inputValue === debouncedInputValue) {
      if (inputValue === '' || isSearchDisabled) {
        if (inputValue !== '') setInputValue('')
        queryClient.invalidateQueries({ queryKey: ['files'] })
      } else {
        queryClient.invalidateQueries({ queryKey: ['files', FileScreen.search] })
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

  useQuery({
    queryKey: ['files', FileScreen.search, debouncedInputValue],
    queryFn: ({ signal }) => getSearchedFiles(inputValue, signal),
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
