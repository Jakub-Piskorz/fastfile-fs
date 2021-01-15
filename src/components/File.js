import pdfIcon from '../images/pdf.svg'
import jpgIcon from '../images/jpg.svg'
import mp3Icon from '../images/mp3.svg'
import API from '../scripts/API'
import style from './App.module.scss'

const File = ({ name = '', fileFormat = '', link = '' }) => {
  console.log
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
    )
      e.currentTarget.classList.toggle(style.selected)
  }

  return (
    <div className={style.file} onClick={selectFile}>
      <img src={icon(fileFormat)} />
      <p>{name}</p>
      <div className={style.checkmark}>
        <span className={style.mark}>✔</span>
      </div>
    </div>
  )
}

export default File
