import style from '@/components/App.module.scss'
import sun from '@/images/sun.svg'
import moon from '@/images/moon.svg'
import CookieScripts from '@/scripts/cookie-scripts'
import React, { useEffect } from 'react'
import { useStore } from '@/hooks/store'

export default () => {
  const { darkMode, setDarkMode } = useStore()
  useEffect(() => {
    const darkModeButton: HTMLInputElement | null = document.querySelector(
      `#${style.switchBtn}`
    )
    if (darkModeButton) darkModeButton.checked = !darkMode
  }, [darkMode])
  const html = document.querySelector('html')
  const changeMode = (e: React.MouseEvent) => {
    if (!html || !e) return
    e.stopPropagation()

    if (html.getAttribute('theme') === 'light') {
      setDarkMode(true)
      html.setAttribute('theme', 'dark')
      CookieScripts.add('theme', 'dark')
    } else {
      setDarkMode(false)
      html.setAttribute('theme', 'light')
      CookieScripts.add('theme', 'light')
    }
  }
  const stop = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div className={style.switch} onClick={stop}>
      <img src={moon} id={style.moon} onClick={stop} />
      <input type="checkbox" id={style.switchBtn} onClick={changeMode} />
      <label htmlFor={style.switchBtn} id={style.label}>
        Toggle
      </label>
      <img src={sun} id={style.sun} onClick={stop} />
    </div>
  )
}
