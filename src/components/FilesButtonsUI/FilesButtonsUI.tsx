import style from './FilesButtonsUI.module.scss'
import contextMenuStyle from '../ContextMenu/ContextMenu.module.css'
import downloadIcon from '@/images/download.svg'
import uploadIcon from '@/images/upload.svg'
import deleteIcon from '@/images/trash.svg'
import plusIcon from '@/images/plus.svg'
import minusIcon from '@/images/minus.svg'
import { MouseEvent } from 'react'
import API from '@/scripts/API'
import { MenuState, useStore } from '@/hooks/store'

const FilesButtonsUI = () => {
  const { selectedItems, setSelectedItems, menuState, setMenuState, setFiles } =
    useStore()

  const onUpload = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const contextMenu: HTMLElement | null = document.querySelector(
      `.${contextMenuStyle.contextMenu}`
    )
    if (menuState === MenuState.upload) {
      setMenuState(MenuState.closed)
      contextMenu?.classList.add(style.hidden)
      return
    }
    const x = e.nativeEvent.clientX
    const y = e.nativeEvent.clientY
    if (contextMenu === null) {
      console.error(`DOM call for context menu returned null.`)
      return
    }
    if (menuState === MenuState.closed) {
      contextMenu?.classList.remove(style.hidden)
      contextMenu.style.top = `115px`
      contextMenu.style.left = ``
      contextMenu.style.right = `42px`
      setMenuState(MenuState.upload)
    }
  }

  const onDelete = async () => {
    for (const item of selectedItems) {
      await API.delete(item)
    }

    const files = await API.listFiles().then((res) =>
      res.ok ? res.json() : console.error('something went wrong')
    )
    setFiles(files)
    setSelectedItems([])
  }
  const onDownload = async () => {
    for (const item of selectedItems) {
      await API.download(item)
    }
    setSelectedItems([])
  }

  return (
    <div className={style['ui']}>
      <button
        className={`${selectedItems.length === 0 ? style.hidden : ''}`}
        onClick={onDelete}
      >
        <img src={deleteIcon} />
      </button>
      <button
        className={`${selectedItems.length === 0 ? style.hidden : ''}`}
        onClick={onDownload}
      >
        <img src={downloadIcon} />
      </button>
      <button>
        <img src={uploadIcon} onClick={onUpload} />
      </button>
      <button>
        <img src={plusIcon} />
      </button>
      <button>
        <img src={minusIcon} />
      </button>
    </div>
  )
}
export default FilesButtonsUI
