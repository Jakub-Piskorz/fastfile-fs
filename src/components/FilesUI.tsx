import style from './App.module.scss'
import downloadIcon from '@/images/download.svg'
import uploadIcon from '@/images/upload.svg'
import React, { useEffect } from 'react'
import CookieScripts from '@/scripts/cookie-scripts'
import API from '@/scripts/API'
import { ContextMenu } from './ContextMenu'

const FilesUI = ({ menuHook, menuState, setMenuState }: any) => {
  const uploadClickHandler = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log(menuState)
    const contextMenu: HTMLElement | null = document.querySelector(
      `.${style.contextMenu}`
    )
    if (menuState === 'upload') {
      setMenuState('closed')
      contextMenu?.classList.add(style.hidden)
      return
    }
    const x = e.nativeEvent.clientX
    const y = e.nativeEvent.clientY
    if (contextMenu === null) {
      console.error(`DOM call for context menu returned null.`)
      return
    }
    if (menuState === 'closed') {
      contextMenu?.classList.remove(style.hidden)
      contextMenu.style.top = `75px`
      contextMenu.style.left = ``
      contextMenu.style.right = `36px`
      setMenuState('upload')
    }
  }
  const download = (e: React.MouseEvent) => {
    console.log(menuHook)
    const _temp: string = menuHook[0].split('-')
    const fileName: string = _temp[0]
    const fileType: string = _temp[_temp.length - 1]
    API.download(CookieScripts.value('token'), menuHook[0])
      .then((response: any) => {
        if (response === null) return
        return response.blob()
      })
      .then((blob) => {
        var url = window.URL.createObjectURL(blob)
        var a = document.createElement('a')
        a.href = url
        a.download = menuHook[0]
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
      .catch((err) => {
        throw new Error(err)
      })
  }
  return (
    <div className={style['ui']}>
      <button
        className={`${menuHook.length === 0 ? style.hidden : ''}`}
        onClick={download}
      >
        <img src={downloadIcon} />
      </button>
      <button onClick={uploadClickHandler}>
        <img src={uploadIcon} />
      </button>
    </div>
  )
}
export default FilesUI
