import { useStore, MenuState, FileDTO } from './store'
import { useMemo } from 'react'
import { routes, useCurrentRoute } from '@/router/router'

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
    if (routes.shared === currentRoute || routes.link === currentRoute) {
      return MenuState.fileLink
    }
    return MenuState.file
  }, [currentRoute])

  return (e: React.MouseEvent, fileDTO?: FileDTO) => {
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
