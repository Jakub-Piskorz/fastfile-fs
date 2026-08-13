import { useStore } from './store'
import { useMemo, MouseEvent } from 'react'
import { routes, useCurrentRoute } from '@/router/router'
import MenuState from '@/types/MenuStateEnum'
import { FileDTO } from '@/api/Api'

const useFileClick = () => {
  const {
    setMenuState,
    menuState,
    setClickedItem,
    contextMenuRef,
    setContextMenuPosition,
    contextMenuPosition
  } = useStore()

  const currentRoute = useCurrentRoute()
  const MenuFileState = useMemo(() => {
    if (routes.shared === currentRoute || routes.download === currentRoute) {
      return MenuState.fileLink
    }
    if (routes.sharedWithMe === currentRoute) {
      return MenuState.fileLinkGuest
    }
    return MenuState.file
  }, [currentRoute])

  return (e: MouseEvent, fileDTO?: FileDTO) => {
    e.preventDefault()
    e.stopPropagation()
    const contextMenu: HTMLElement | null = contextMenuRef?.current || null
    if (!contextMenu) {
      console.error(`contextMenu HTML Element returns null in Files.tsx`)
      return
    }
    // on right click:
    if (e.nativeEvent.button === 2) {
      const posX = e.nativeEvent.clientX
      const posY = e.nativeEvent.clientY
      setContextMenuPosition({ ...contextMenuPosition, left: posX, top: posY })

      if (!fileDTO) {
        setMenuState(MenuState.background)
      } else if (fileDTO?.metadata.type === 'file') {
        setClickedItem(fileDTO)
        setMenuState(MenuFileState)
      } else if (fileDTO.metadata.type === 'directory') {
        setClickedItem(fileDTO)
        setMenuState(MenuState.directory)
      }
    } else {
      if (menuState !== MenuState.closed) setMenuState(MenuState.closed)
    }
  }
}

export default useFileClick
