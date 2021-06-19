import pdfIcon from '../images/pdf.svg'
import jpgIcon from '../images/jpg.svg'
import mp3Icon from '../images/mp3.svg'
import API from '../scripts/API'
import style from './App.module.scss'
import React, { MouseEvent, useEffect } from 'react'

const File = ({
  slug = '',
  name = '',
  fileFormat = '',
  selected = false,
  onContextMenu = (...args: any) => {console.error("error: onContextMenu function not found")},
  mouseUp = (...args: any) => {console.error("error: mouseUp function not found")},
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

  const selectFile = (event: MouseEvent) => {
    if (!event) return
    event.stopPropagation()
    event.preventDefault()
    const target = event.target as HTMLElement
    const currentTarget = event.currentTarget as HTMLElement
    if (
      target.classList[0] === style.checkmark ||
      target.classList[0] === style.mark
    ) {
      currentTarget.classList.toggle(style.selected)
      selected = currentTarget.classList.contains(style.selected) ? true : false
    }
    console.log(selected)
  }

  const stop = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
  }

  return (
    <div className={style.file} onContextMenu={onContextMenu} onClick={selectFile} onMouseUp={(e: MouseEvent) => {mouseUp(e, slug)}}>
      <img src={icon(fileFormat)} draggable="false" />
      <p>{name}</p>
      <div className={style.checkmark}>
        <span className={style.mark}>✔</span>
      </div>
    </div>
  )
}

export default File
