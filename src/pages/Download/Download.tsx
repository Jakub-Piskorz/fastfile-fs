import Overlay from '@/components/Overlay/Overlay'
import { useLoaderData } from 'react-router-dom'
import style from './Download.module.css'
import File from '@/components/File/File'
import FilesHeader from '@/components/FilesHeader/FilesHeader'

export const Download = () => {
  const data = useLoaderData()
  if (!data) return <div className={style.downloadSection}>Nothing</div>

  return (
    <>
      <Overlay />
      <div className={style.downloadSection}>
        <FilesHeader title="Shared file" />
        <div className={style.filesContainer}>
          <File name={data.name} type={data.type} />
        </div>

      </div>

      <h1>{data?.uuid}</h1>
    </>
  )
}

export default Download
