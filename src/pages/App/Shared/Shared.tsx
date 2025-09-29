import Overlay from '@/components/Overlay/Overlay'
import { useLoaderData } from 'react-router-dom'
import style from './Shared.module.css'
import File from '@/components/File/File'
import FilesHeader from '@/components/FilesHeader/FilesHeader'
import API from '@/scripts/API'

const Shared = () => {
  const files = useLoaderData()

  if (!files) return <div className={style.downloadSection}>Nothing</div>

  return (
    <>
      <Overlay />
      <div className={style.sharedSection}>
        <FilesHeader title="Shared files" />
        <div className={style.filesContainer}>
          {!files && 'No shared files yet.'}
          {files && files.map((file: any, i: number) => (
            <File name={file.name} type={file.type} key={i} />
          ))}

        </div>

      </div>

      <h1>{files?.uuid}</h1>
    </>
  )
}

Shared.loader = async () => {
  const res = await API.myLinks()
  if (res.ok) {
    return await res.json()
  }
  return null
}

export default Shared
