import { DragEvent, useEffect, MouseEvent, useMemo } from 'react'
import API from '@/scripts/API.js'
import File from '../File/File'
import FilesButtonsUI from '../FilesButtonsUI/FilesButtonsUI'
import folderBlackIcon from '@/images/folder-black.svg'
import searchIcon from '@/images/search-black.svg'
import style from './Files.module.scss'
import { MenuState, OverlayState, useStore } from '@/hooks/store'
import Overlay from '../Overlay/Overlay'

const Files = () => {
  const {
    setMenuState,
    menuState,
    username,
    setClickedItem,
    files,
    setFiles,
    searchedFiles,
    contextMenuRef,
    iconSize,
    setOverlay,
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

  useEffect(() => {
    refresh()
  }, [])

  const stop = (e: MouseEvent) => {
    e.preventDefault()
  }
  const onDrag = (e: MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setOverlay(OverlayState.upload)
    console.log(e.target)
  }
  const onDragStop = (e: MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setOverlay(OverlayState.hidden)
    console.log(e.target)
  }

  const upload = (e: DragEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setOverlay(OverlayState.hidden)
    console.log(e.target)
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

    const contextMenu: HTMLElement | null = contextMenuRef?.current || null
    if (!contextMenu) {
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
      <Overlay />
      <div
        className={style['files-window']}
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
          onDragOver={stop}
          onDrop={upload}
          onDragEnter={onDrag}
          onDragLeave={onDragStop}
          onMouseUp={(e) => clickHandler(e, 'background')}
          icon-size={String(iconSize)}
        >
          {currentFiles
            ? currentFiles.map((file: any, i: number) => {
                return (
                  <File
                    name={file.name}
                    type={file.type}
                    key={i}
                    onDragOver={(e) => e.stopPropagation()}
                    onMouseUp={(e) => clickHandler(e, file.type)}
                  />
                )
              })
            : 'Loading files, please wait...'}
        </div>
      </div>
    </>
  )
}

export default Files
