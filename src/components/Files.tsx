import React, { DragEventHandler, MouseEventHandler, useEffect, useState, MouseEvent } from 'react'
import toggleNav from '@/scripts/toggle-nav.js'
import API from '@/scripts/API.js'
import File from './File'
import folderBlack from '@/images/folder-black.svg'
import style from './App.module.scss'
import CookieScripts from '../scripts/cookie-scripts'

const Files = (props: any) => {
  const [files, setFiles]: any = useState(false)

  const refresh = () => {
    API.read(CookieScripts.value('token')).then((response) => {
      setFiles(response)
    })
  }

  useEffect(() => {
    refresh()
    setInterval(() => {
      refresh()
    }, 2000)
  }, [])

  const stop = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
  }

  const upload = (e: React.DragEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (e.dataTransfer.files[0])
      API.upload(
        CookieScripts.value('token'),
        '',
        e.dataTransfer.files[0]
      ).then(() => refresh())
  }

  const clickHandler = (e: React.MouseEvent, slug: string | null) => {
    e.preventDefault()
    e.stopPropagation()
    const contextMenu: HTMLElement | null = document.querySelector(`.${style.contextMenu}`)
    if (contextMenu === null) {
      console.error(`contextMenu HTML Element returns null in Files.tsx`)
      return
    }
    const isRightClicked = e.nativeEvent.which === 3 ? true : false
    if (isRightClicked) {
      const posX = e.nativeEvent.clientX
      const posY = e.nativeEvent.clientY
      contextMenu.style.top = `${Math.min(posY, window.innerHeight - 70)}px`
      contextMenu.style.left = `${Math.min(posX, window.innerWidth - 200)}px`
      contextMenu.style.right = ``
      props.setMenuHook(slug)
      props.setMenuState('file')
    } else {
      props.setMenuHook(null)
      props.setMenuState('closed')
    }
  }

  return (
    <>
      <span
        className={`${style['sidebar-mask']} ${style.hidden}`}
        onClick={toggleNav}
      ></span>
      <div className={style['files-window']} onDrop={upload} onDragOver={stop}>
        <h1>
          <img className={style['folder-black']} src={folderBlack} />
          {props.name}
        </h1>
        <div className={style.files} onContextMenu={stop}>
          {files.files
            ? files.files.map((file: any, i: number) => (
                <File //needs refactoring
                  name={file.name.slice(0, 20)}
                  fileFormat={file.type}
                  slug={file.slug}
                  key={i}
                  onContextMenu={stop}
                  mouseUp={clickHandler}
                />
              ))
            : 'Loading files...'}
        </div>
      </div>
    </>
  )
}

export default Files
