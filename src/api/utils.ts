import { useStore } from '@/hooks/store'
import { routes, useCurrentRoute } from '@/router/router'
import { useLocation, useNavigate } from 'react-router-dom'
import Api, { StreamingResponseBody } from '.'
import { FileDTO } from './Api'
import MenuState from '@/types/MenuStateEnum'
import { joinPaths } from '@/scripts/utils'
import { AxiosResponse } from 'axios'

export const useDeleteRecursively = () => {

  const { setMenuState, setFiles } = useStore()
  const currentRoute = useCurrentRoute()
  const navigate = useNavigate()
  const location = useLocation()
  const apiCall = useListFilesApiCall()

  return async function deleteRecursively(file: FileDTO) {
    setMenuState(MenuState.closed)
    await Api.api.deleteRecursively(joinPaths(location.pathname, file.metadata?.name))

    // If we're on link page, deleting file also deletes the link, therefore return to main page
    if (currentRoute === routes.download) {
      navigate(routes.app)
      return
    }
    let files = await apiCall(joinPaths(location.pathname)).then((res) =>
      res.data
    )
    if (!Array.isArray(files)) {
      files = [files]
    }
    setFiles(files)
  }
}

export const download = (filePaths: string[] = []) => {
  if (filePaths.length === 0) return
  let fetchCall: Promise<AxiosResponse<StreamingResponseBody, any>>
  let fileName: string
  if (filePaths.length === 1) {
    fetchCall = Api.api.downloadFile(filePaths[0])
  } else {
    fetchCall = Api.api.downloadMultiple({ filePaths })
  }

  return fetchCall
    .then((response: AxiosResponse<object>) => {
      if (!response || response.status !== 200) {
        throw new Error(
          `Error code: ${response?.status}. File cannot be downloaded.`
        )
      }

      // Extract file name from response header.
      fileName = response.headers
        .get('content-disposition')!
        .match(/filename="?([^"]+)"?/i)?.[1] as string
      return response.blob()
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      a.remove()
    })
}

export const useListFilesApiCall = () => {
  const currentRoute = useCurrentRoute()
  if (currentRoute === routes.app) return Api.api.filesInDirectory
  if (currentRoute === routes.shared) return Api.api.getMyLinks
  if (currentRoute === routes.sharedWithMe) return Api.api.linksSharedToMe
  if (currentRoute === routes.download) return Api.api.lookupLinkFile
  return Api.api.filesInDirectory // Default
}

