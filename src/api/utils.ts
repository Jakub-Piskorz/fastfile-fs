import { useStore } from '@/hooks/store'
import { routes, useCurrentRoute } from '@/router/router'
import { useLocation, useNavigate } from 'react-router-dom'
import Api from '.'
import { FileDTO } from './Api'
import MenuState from '@/types/MenuStateEnum'
import { joinPaths, normalizeFiles } from '@/scripts/utils'

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
    setFiles(normalizeFiles(files))
  }
}

export const download = async (filePaths: string[] = []) => {
  if (filePaths.length === 0) return
  const response = filePaths.length === 1 ?
    await Api.api.downloadFile(filePaths[0], { format: 'blob' }) :
    await Api.api.downloadMultiple({ filePaths }, { format: 'blob' })

  if (response.status !== 200) {
    throw new Error(
      `Error code: ${response?.status}. File cannot be downloaded.`
    )
  }

  // Extract file name from response header.
  const fileName = response.headers['content-disposition']!
    .match(/filename="?([^"]+)"?/i)?.[1]

  const url = window.URL.createObjectURL(response.data as Blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  a.remove()
}

export const useListFilesApiCall = () => {
  const currentRoute = useCurrentRoute()
  if (currentRoute === routes.app) return Api.api.filesInDirectory
  if (currentRoute === routes.shared) return Api.api.getMyLinks
  if (currentRoute === routes.sharedWithMe) return Api.api.linksSharedToMe
  if (currentRoute === routes.download) return Api.api.lookupLinkFile
  return Api.api.filesInDirectory // Default
}

