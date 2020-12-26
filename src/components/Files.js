import { useEffect, useState } from 'react'
import toggleNav from '@/scripts/toggle-nav.js'
import API from '@/scripts/API.js'
import File from './File'
import folderBlack from '../images/folder-black.svg'
import style from '@/style.module.scss'
import CookieScripts from '../scripts/cookie-scripts'

const Files = (props) => {
  const [files, setFiles] = useState(false)
  useEffect(() => {
    API.read(CookieScripts.value('token')).then((response) => {
      setFiles(response)
    })
    setInterval(
      () =>
        API.read(CookieScripts.value('token')).then((response) => {
          setFiles(response)
        }),
      1000
    )
  }, [])

  const stop = (e) => {
    e.stopPropagation()
    e.preventDefault()
  }

  const upload = (e) => {
    e.stopPropagation()
    e.preventDefault()
    API.upload(`qbek`, ``, e.dataTransfer.files[0]).then(
      API.read(`qbek`).then((response) =>
        response.ok ? setFiles(response) : console.log(response)
      )
    )
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
                <File name={file.name.slice(0, 20)} type={file.type} key={i} />
              ))
            : 'Loading...'}
        </div>
      </div>
    </>
  )
}

export default Files
