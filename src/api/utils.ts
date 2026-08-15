import { useStore } from '@/hooks/store'
import { routes, useCurrentRoute } from '@/router/router'
import { useLocation, useNavigate } from 'react-router-dom'
import Api from '.'
import { FileDTO } from './Api'
import MenuState from '@/types/MenuStateEnum'
import { joinPaths } from '@/scripts/utils'
import { useQueryClient } from '@tanstack/react-query'

export const useDeleteRecursively = () => {

  const queryClient = useQueryClient()
  const { setMenuState } = useStore()
  const currentRoute = useCurrentRoute()
  const navigate = useNavigate()
  const location = useLocation()

  return async function deleteRecursively(file: FileDTO) {
    setMenuState(MenuState.closed)
    const filePath = encodeURIComponent(joinPaths(location.pathname, file.metadata?.name))
    await Api.api.deleteRecursively(filePath)

    // Reload files
    await queryClient.invalidateQueries({ queryKey: ['files'] })

    // If we're on link page, deleting file also deletes the link, therefore return to main page
    if (currentRoute === routes.download) {
      navigate(routes.app)
      return
    }
  }
}

export const download = async (filePaths: string[] = [], uuid?: string) => {
  if (filePaths.length === 0 && !uuid) return

  filePaths = filePaths.map(path => encodeURIComponent(path))

  const response = uuid ?
    await Api.api.downloadFileFromLink(uuid, { format: 'blob' }) :
    filePaths.length === 1 ?
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

