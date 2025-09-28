import Overlay from '@/components/Overlay/Overlay'
import { useLoaderData } from 'react-router-dom'
import style from './Download.module.css'
import File from '@/components/File/File'
import FilesHeader from '@/components/FilesHeader/FilesHeader'
import API from '@/scripts/API'
import { LoaderFunctionArgs } from 'react-router-dom'

const Download = () => {

  const data = useLoaderData()
  if (!data) return <div className={style.downloadSection}>Download link doesn't exist</div>

  return (
    <>
      <Overlay />
      <div className={style.downloadSection}>
        <FilesHeader title="Shared with me" />
        <div className={style.filesContainer}>
          <File name={data.name} type={data.type} />
        </div>

      </div>

      <h1>{data?.uuid}</h1>
    </>
  )
}

Download.loader = async ({ params }: LoaderFunctionArgs) => {
  const res = await API.lookupLink(params.uuid)
  if (res.ok) {
    return await res.json()
  }
  return null
}

export default Download
