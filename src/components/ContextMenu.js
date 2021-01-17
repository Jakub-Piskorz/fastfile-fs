import { useEffect } from 'react'
import API from '@/scripts/API'
import style from './App.module.scss'
import CookieScripts from '@/scripts/cookie-scripts'

const ContextMenu = ({ menuHook }) => {
  const download = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const _temp = menuHook.split('-')
    const fileName = _temp[0]
    const fileType = _temp[_temp.length - 1]
    API.download(CookieScripts.value('token'), menuHook)
      .then((response) => response.blob())
      .then((blob) => {
        var url = window.URL.createObjectURL(blob)
        var a = document.createElement('a')
        a.href = url
        a.download = `${fileName}.${fileType}`
        document.body.appendChild(a) // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click()
        a.remove() //afterwards we remove the element again
      })
  }

  return (
    <div className={`${style.contextMenu} ${menuHook ? '' : style.hidden}`}>
      <ul>
        <li onMouseUp={download}>Download</li>
      </ul>
    </div>
  )
}

export default ContextMenu
