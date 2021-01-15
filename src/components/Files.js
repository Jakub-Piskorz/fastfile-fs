import { useEffect, useState } from 'react'
import toggleNav from '@/scripts/toggle-nav.js'
import API from '@/scripts/API.js'
import File from './File'
import folderBlack from '../images/folder-black.svg'
import style from './App.module.scss'
import CookieScripts from '../scripts/cookie-scripts'

const Files = (props) => {
  const [files, setFiles] = useState(false)
  const selectedFiles = () => {
    document.querySelectorAll(`.${style.file}.${style.selected}`)
  }

  const refresh = () => {
    API.read(CookieScripts.value('token')).then((response) => {
      setFiles(response)
    })
  }

  useEffect(() => {
    refresh()
    setInterval(() => refresh(), 15000)
  }, [])

  const stop = (e) => {
    e.stopPropagation()
    e.preventDefault()
  }

  const upload = (e) => {
    e.stopPropagation()
    e.preventDefault()
    if (e.dataTransfer.files[0])
      API.upload(
        CookieScripts.value('token'),
        '',
        e.dataTransfer.files[0]
      ).then(() => refresh())
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
        <div className={style.files}>
          {files.files
            ? files.files.map((file, i) => (
                <File
                  name={file.name.slice(0, 20)}
                  fileFormat={file.type}
                  key={i}
                />
              ))
            : 'Loading files...'}
        </div>
      </div>
    </>
  )
}

export default Files
