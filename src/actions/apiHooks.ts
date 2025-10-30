import MenuState from '@/types/MenuStateEnum'
import API, { useListFilesApiCall } from '@/actions/API'
import { joinPaths } from '@/scripts/utils'
import { routes, useCurrentRoute } from '@/router/router'
import { useStore } from '@/hooks/store'
import { useLocation, useNavigate } from 'react-router-dom'
import FileDTO from '@/types/FileDTO'

export const useDeleteRecursively = () => {

  const { setMenuState, setFiles } = useStore()
  const currentRoute = useCurrentRoute()
  const navigate = useNavigate()
  const location = useLocation()
  const apiCall = useListFilesApiCall()

  return async function deleteRecursively(file: FileDTO) {
    setMenuState(MenuState.closed)
    await API.deleteRecursively(joinPaths(location.pathname, file.metadata.name))

    // If we're on link page, deleting file also deletes the link, therefore return to main page
    if (currentRoute === routes.download) {
      navigate(routes.app)
      return
    }
    let files = await apiCall(joinPaths(location.pathname)).then((res) =>
      res.ok ? res.json() : console.error('something went wrong')
    )
    if (!Array.isArray(files)) {
      files = [files]
    }
    setFiles(files)
  }
}