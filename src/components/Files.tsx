import React, { DragEvent, useEffect, useState, MouseEvent } from 'react'
import toggleNav from '@/scripts/toggle-nav.js'
import API from '@/scripts/API.js'
import File from './File'
import FilesButtonsUI from './FilesButtonsUI'
import folderBlack from '@/images/folder-black.svg'
import download from '@/images/download.svg'
import style from './App.module.scss'
import CookieScripts from '../scripts/cookie-scripts'
import { useStore } from '@/hooks/store'

const Files = () => {
  const { setMenuState, username, setClickedItem } = useStore()
  const [files, setFiles]: any = useState(null)

  const refresh = async () => {
    await API.read(CookieScripts.value('token')).then((response) => {
      setFiles(response)
    })
    return
  }
  const setFileSize = async (
    inputSize: 1 | 2 | 3 | 4 | 5 | 6 | null = null
  ) => {
    const filesElement: HTMLElement | null = document.querySelector(
      `.${style.files}`
    )
    if (filesElement === null) return
    if (inputSize) {
      filesElement.setAttribute('file-size', inputSize.toString())
      CookieScripts.add('file-size', inputSize.toString())
      return
    }
    const SizeFromCookie: string | null = await API.read(
      CookieScripts.value('file-size')
    )
    if (SizeFromCookie === null) {
      filesElement.setAttribute('file-size', '3')
      return
    } else if (/[1-6]/.test(SizeFromCookie)) {
      filesElement.setAttribute('file-size', SizeFromCookie)
      return
    } else {
      console.error(
        `Something went wrong.\n
        filesElement: ${filesElement}, SizeFromCookie: ${SizeFromCookie}, inputSize: ${inputSize}`
      )
      return
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const stop = (e: MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
  }

  const upload = (e: DragEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (e.dataTransfer.files[0])
      API.upload(
        CookieScripts.value('token'),
        '',
        e.dataTransfer?.files[0] as FileList[0]
      ).then(() => refresh())
  }

  const clickHandler = (e: MouseEvent, slug: string | null) => {
    e.preventDefault()
    e.stopPropagation()
    const contextMenu: HTMLElement | null = document.querySelector(
      `.${style.contextMenu}`
    )
    if (contextMenu === null) {
      console.error(`contextMenu HTML Element returns null in Files.tsx`)
      return
    }
    // Is right click?
    if (e.nativeEvent.button === 2) {
      const posX = e.nativeEvent.clientX
      const posY = e.nativeEvent.clientY
      contextMenu.style.top = `${Math.min(posY, window.innerHeight - 70)}px`
      contextMenu.style.left = `${Math.min(posX, window.innerWidth - 200)}px`
      contextMenu.style.right = ``
      setClickedItem(e.currentTarget.children[1].innerHTML)
      setMenuState('file')
    } else {
      setMenuState('closed')
    }
  }

  return (
    <>
      <span
        className={`${style['sidebar-mask']} ${style.hidden}`}
        onClick={toggleNav}
      ></span>
      <div className={style['files-window']} onDrop={upload} onDragOver={stop}>
        <div className={style['ui-container']}>
          <h1>
            <img className={style['folder-black']} src={folderBlack} />
            {username}
            {/* <button onClick={() => setFileSize(1)}>bigger</button>
          <button onClick={() => setFileSize(4)}>smaller</button> */}
          </h1>
          <FilesButtonsUI />
        </div>
        <div className={style.files} onContextMenu={stop}>
          {files
            ? files.map((file: any, i: number) => {
                return (
                  <File
                    name={file.name}
                    type={file.type}
                    key={i}
                    onContextMenu={stop}
                    mouseUp={clickHandler}
                  />
                )
              })
            : 'Loading files...'}
        </div>
      </div>
    </>
  )
}

export default Files
