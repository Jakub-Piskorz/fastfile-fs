import style from './App.module.scss'
import downloadIcon from '@/images/download.svg'
import { useEffect } from 'react'
import CookieScripts from '@/scripts/cookie-scripts'
import API from '@/scripts/API'

const FilesUI = ({ menuHook }: any) => {
  const download = (e: React.MouseEvent) => {
    console.log(menuHook)
    const _temp: string = menuHook[0].split('-')
    const fileName: string = _temp[0]
    const fileType: string = _temp[_temp.length - 1]
    API.download(CookieScripts.value('token'), menuHook[0])
      .then((response: any) => {
        if (response === null) return
        return response.blob()
      })
      .then((blob) => {
        var url = window.URL.createObjectURL(blob)
        var a = document.createElement('a')
        a.href = url
        a.download = menuHook[0]
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
      .catch((err) => {
        throw new Error(err)
      })
  }
  return (
    <div className={style['ui']}>
      <button
        className={`${menuHook.length === 0 ? style.hidden : ''}`}
        onClick={download}
      >
        DOWNLOAD
        <img src={downloadIcon} />
      </button>
    </div>
  )
}
export default FilesUI
