import { createRef } from 'react'
import { create } from 'zustand'

export enum MenuState {
  closed,
  file,
  fileLink,
  directory,
  profile,
  upload,
  background,
  newDir,
  shareChoice,
  privateShare,
  publicShare,
}

export enum OverlayState {
  hidden,
  sidebar,
  upload,
}

export interface FileLink {
  uuid: string,
  ownerId: number,
  path: string,
  isPublic: boolean,
  fileLinkShares: FileLinkShare[]
}

export interface FileLinkShare {
  id: number,
  fileLinkUuid: string,
  sharedUserEmail: string,
}

export interface metadataDTO {
  name: string,
  size: number,
  lastModified: number,
  type: 'directory' | 'file',
  path: string,
}

export interface FileLinkDTO {
  metadata: metadataDTO,
  fileLink: FileLink,
}

export interface StoreI {
  username: string
  setUsername: (newUsername: string) => void

  selectedItems: string[]
  setSelectedItems: (newSelectedItems: string[]) => void

  clickedItem?: string
  setClickedItem: (newClickedItem: string) => void

  menuState: MenuState
  setMenuState: (newMenuState: this['menuState']) => void

  darkMode: boolean
  setDarkMode: (newDarkMode: boolean) => void

  files: {
    lastModified: number
    name: string
    path: string
    size: number
    type: string
  }[]
  setFiles: (files: this['files']) => void

  fileLinks: FileLinkDTO[]
  setFileLinks: (newFileLinks: this['fileLinks']) => void

  searchedFiles: this['files'] | null
  setSearchedFiles: (searchedFiles: this['files'] | null) => void

  iconSize: 1 | 2 | 3 | 4 | 5
  setIconSize: (iconSize: this['iconSize']) => void

  overlay: OverlayState
  setOverlay: (overlay: this['overlay']) => void

  sidebarRef: React.RefObject<HTMLDivElement | null> | null
  contextMenuRef: React.RefObject<HTMLDivElement | null> | null

  contextMenuPosition: { top: number; left: number; width: number }
  setContextMenuPosition: (contextMenuPosition: this['contextMenuPosition']) => void

}

export const useStore = create<StoreI>()((set) => ({
  // Global states as setter/getter pairs:
  username: 'Loading',
  setUsername: (username) => set(() => ({ username })),

  selectedItems: [],
  setSelectedItems: (selectedItems) => set(() => ({ selectedItems })),

  clickedItem: undefined,
  setClickedItem: (clickedItem) => set(() => ({ clickedItem })),

  menuState: MenuState.closed,
  setMenuState: (menuState) => set(() => ({ menuState })),

  darkMode: false,
  setDarkMode: (darkMode) => set(() => ({ darkMode })),

  files: [],
  setFiles: (files) => set(() => ({ files })),

  fileLinks: [],
  setFileLinks: (fileLinks) => set(() => ({ fileLinks })),

  searchedFiles: null,
  setSearchedFiles: (searchedFiles) => set(() => ({ searchedFiles })),

  iconSize:
    (Number(localStorage.getItem('icon-size')) as StoreI['iconSize']) || 3,
  setIconSize: (iconSize) => set(() => ({ iconSize })),

  overlay: OverlayState.hidden,
  setOverlay: (overlay) => set(() => ({ overlay })),

  contextMenuPosition: { top: 0, left: 0, width: 300 },
  setContextMenuPosition: (contextMenuPosition) => set(() => ({ contextMenuPosition })),

  // Refs:
  sidebarRef: createRef(),
  contextMenuRef: createRef()
}))
