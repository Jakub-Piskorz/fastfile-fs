import { DragEvent, useEffect, MouseEvent, useMemo } from 'react'
import toggleNav from '@/scripts/toggle-nav.js'
import API from '@/scripts/API.js'
import File from '../File/File'
import FilesButtonsUI from '../FilesButtonsUI/FilesButtonsUI'
import folderBlackIcon from '@/images/folder-black.svg'
import searchIcon from '@/images/search-black.svg'
import style from './Files.module.scss'
import contextMenuStyle from '../ContextMenu/ContextMenu.module.css'
import CookieScripts from '../../scripts/cookie-scripts'
import { MenuState, useStore } from '@/hooks/store'

const Files = () => {
  const {
    setMenuState,
    menuState,
    username,
    setClickedItem,
    files,
    setFiles,
    searchedFiles,
  } = useStore()

  const currentFiles = useMemo(
    () => searchedFiles || files,
    [files.length, searchedFiles?.length]
  )

  const refresh = async () => {
    try {
      const files = await API.listFiles().then((response) => {
        if (response.ok) return response.json()
      })
      setFiles(files)
      return
    } catch (e) {
      console.error(e)
    }
  }
  // TODO: Move somewhere else and implement
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
    const SizeFromCookie: string | null = CookieScripts.value('file-size')
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
      API.upload('', e.dataTransfer?.files[0] as FileList[0]).then(() =>
        refresh()
      )
  }

  const clickHandler = (
    e: MouseEvent,
    type: 'file' | 'background' | 'directory'
  ) => {
    e.preventDefault()
    e.stopPropagation()
    const contextMenu: HTMLElement | null = document.querySelector(
      `.${contextMenuStyle.contextMenu}`
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
      if (type === 'file') {
        setClickedItem(e.currentTarget.children[1].innerHTML)
        setMenuState(MenuState.file)
      } else if (type === 'background') {
        setMenuState(MenuState.background)
      } else if (type === 'directory') {
        setClickedItem(e.currentTarget.children[1].innerHTML)
        setMenuState(MenuState.directory)
      }
    } else {
      if (menuState !== MenuState.closed) setMenuState(MenuState.closed)
    }
  }

  return (
    <>
      <span
        className={`${style['sidebar-mask']} ${style.hidden}`}
        onClick={toggleNav}
      ></span>
      <div
        className={style['files-window']}
        onDrop={upload}
        onDragOver={stop}
        onMouseUp={() => setMenuState(MenuState.closed)}
      >
        <div className={style.uiContainer}>
          <h1>
            <img
              className={style.folderBlack}
              src={searchedFiles ? searchIcon : folderBlackIcon}
            />
            <div>{username}</div>
          </h1>
          <FilesButtonsUI />
        </div>
        <div
          className={style.files}
          onContextMenu={stop}
          onMouseUp={(e) => clickHandler(e, 'background')}
        >
          {currentFiles
            ? currentFiles.map((file: any, i: number) => {
                return (
                  <File
                    name={file.name}
                    type={file.type}
                    key={i}
                    onContextMenu={stop}
                    mouseUp={(e) => clickHandler(e, file.type)}
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
