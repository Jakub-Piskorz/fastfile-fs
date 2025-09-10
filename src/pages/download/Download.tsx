import FilesButtonsUI from '@/components/FilesButtonsUI/FilesButtonsUI'
import Overlay from '@/components/Overlay/Overlay'
import { useLoaderData } from 'react-router'
import style from './Download.module.scss'
import File from '@/components/File/File'

export const Download = () => {
  const data = useLoaderData()
  console.log(data)

  return (
    <>
      <Overlay />
      <div className={style.downloadSection}>
        <div className={style.uiContainer}>
          <FilesButtonsUI />
        </div>
        <File name={data.name} type={data.type} />
      </div>

      <h1>{data?.uuid}</h1>
    </>
  )
}

export default Download
