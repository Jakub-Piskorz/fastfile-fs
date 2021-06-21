import pdfIcon from '../images/pdf.svg'
import jpgIcon from '../images/jpg.svg'
import mp3Icon from '../images/mp3.svg'
import API from '../scripts/API'
import style from './App.module.scss'
import React, { MouseEvent, useEffect, useState } from 'react'

const File = ({
  slug = '',
  name = '',
  fileFormat = '',
  menuHook = [],
  setMenuHook = (...args: any) => {
    console.error('error: setMenuHook not found')
  },
  onContextMenu = (...args: any) => {
    console.error('error: onContextMenu function not found')
  },
  mouseUp = (...args: any) => {
    console.error('error: mouseUp function not found')
  },
}) => {
  const icon = (fileFormat: string) => {
    switch (fileFormat) {
      case 'image/jpeg':
        return jpgIcon
      case 'image/png':
        return jpgIcon
      case 'application/pdf':
        return pdfIcon
      case 'audio/mp3':
        return mp3Icon
      case 'audio/mp4':
        return mp3Icon
      case 'audio/mpeg':
        return mp3Icon
      default:
        return
    }
  }
  const [selected, setSelected]: any = useState(false)

  const selectFile = (event: MouseEvent) => {
    if (!event) return
    event.stopPropagation()
    event.preventDefault()
    const target = event.target as HTMLElement
    const currentTarget = event.currentTarget as HTMLElement
    // Did user click the select button?
    if (
      target.classList[0] === style.checkmark ||
      target.classList[0] === style.mark
    ) {
      // Is file selected?
      if (currentTarget.classList.contains(style.selected)) {
        // Unselect file.
        setSelected(false)
        currentTarget.classList.remove(style.selected)
        // menuHook.filter(item => item !== slug) intended
        let [..._newHook] = [...menuHook] as Array<string>
        if (_newHook.length > 0)
          _newHook = _newHook.filter((file) => file !== slug)
        setMenuHook(_newHook)
      } else {
        // Select file.
        setSelected(true)
        currentTarget.classList.add(style.selected)
        // menuHook.add(slug) intended
        let [..._newHook] = [...menuHook] as Array<string>
        _newHook.push(slug)
        setMenuHook(_newHook)
      }
    }
  }

  const stop = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
  }

  return (
    <div
      className={style.file}
      onContextMenu={onContextMenu}
      onClick={selectFile}
      onMouseUp={(e: MouseEvent) => {
        mouseUp(e, slug)
      }}
    >
      <img src={icon(fileFormat)} draggable="false" />
      <p>{name}</p>
      <div className={style.checkmark}>
        <span className={style.mark}>✔</span>
      </div>
    </div>
  )
}

export default File
