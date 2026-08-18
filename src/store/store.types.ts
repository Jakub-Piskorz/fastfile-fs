import { FileDTO } from '@/api/Api'
import MenuState from '@/types/MenuStateEnum'

export interface StoreI {
  username: string
  setUsername: (newUsername: string) => void

  selectedFiles: FileDTO[]
  setSelectedFiles: (newSelectedFiles: FileDTO[]) => void

  clickedItem?: FileDTO
  setClickedItem: (newClickedItem: this['clickedItem']) => void

  menuState: MenuState
  setMenuState: (newMenuState: this['menuState']) => void

  darkMode: boolean
  setDarkMode: (newDarkMode: boolean) => void

  iconSize: 1 | 2 | 3 | 4 | 5
  setIconSize: (iconSize: this['iconSize']) => void

  sidebarRef: React.RefObject<HTMLDivElement | null> | null
  contextMenuRef: React.RefObject<HTMLDivElement | null> | null

  contextMenuPosition: { top?: number; bottom?: number; left?: number; width: number, right?: number }
  setContextMenuPosition: (contextMenuPosition: this['contextMenuPosition']) => void
}