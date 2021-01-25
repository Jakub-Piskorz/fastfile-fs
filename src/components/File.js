import pdfIcon from '../images/pdf.svg'
import jpgIcon from '../images/jpg.svg'
import mp3Icon from '../images/mp3.svg'
import API from '../scripts/API'
import style from './App.module.scss'
import { useEffect } from 'react'

const File = ({
  name = '',
  fileFormat = '',
  slug = '',
  selected = false,
  i = '',
  setMenuFile = null,
  onMouseUp,
  ref,
  innerProps,
}) => {
  const icon = (fileFormat) => {
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

  const selectFile = (e) => {
    e.stopPropagation()
    e.preventDefault()
    if (
      e.target.classList[0] === style.checkmark ||
      e.target.classList[0] === style.mark
    ) {
      e.currentTarget.classList.toggle(style.selected)
      selected = true
    }
  }

  const stop = (e) => {
    e.stopPropagation()
    e.preventDefault()
  }

  return (
    <div className={style.file} onClick={selectFile} onMouseUp={onMouseUp}>
      <img src={icon(fileFormat)} draggable="false" />
      <p>{name}</p>
      <div className={style.checkmark}>
        <span className={style.mark}>✔</span>
      </div>
    </div>
  )
}

export default File
