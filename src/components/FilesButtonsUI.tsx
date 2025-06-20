import style from './App.module.scss'
import downloadIcon from '@/images/download.svg'
import uploadIcon from '@/images/upload.svg'
import React from 'react'
import CookieScripts from '@/scripts/cookie-scripts'
import API from '@/scripts/API'

const FilesButtonsUI = ({ selectedItems, menuState, setMenuState }: any) => {
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

  return (
    <div className={style['ui']}>
      <button
        className={`${selectedItems.length === 0 ? style.hidden : ''}`}
        onClick={() => API.download(selectedItems[0])}
      >
        <img src={downloadIcon} />
      </button>
      <button onClick={uploadClickHandler}>
        <img src={uploadIcon} />
      </button>
    </div>
  )
}
export default FilesButtonsUI
