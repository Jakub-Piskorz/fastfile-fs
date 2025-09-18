import FilesButtonsUI from '@/components/FilesButtonsUI/FilesButtonsUI'
import Overlay from '@/components/Overlay/Overlay'
import { useLoaderData } from 'react-router-dom'
import style from './Download.module.css'
import File from '@/components/File/File'
import folderBlackIcon from '@/images/folder-black.svg'

export const Download = () => {
  const data = useLoaderData()
  if (!data) return <div className={style.downloadSection}>Nothing</div>

  return (
    <>
      <Overlay />
      <div className={style.downloadSection}>
        <div className={style.uiContainer}>
          <h1>
            <img
              className={style.folderBlack}
              src={folderBlackIcon}
              alt="sharedFile" />
            <div>Shared file</div>
          </h1>
          <FilesButtonsUI />
        </div>
        <div className={style.filesContainer}>
          <File name={data.name} type={data.type} />
        </div>

      </div>

      <h1>{data?.uuid}</h1>
    </>
  )
}

export default Download
