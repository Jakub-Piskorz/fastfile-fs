import React, { createRef } from 'react'
import { create } from 'zustand'
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

  files: FileDTO[]
  setFiles: (files: this['files']) => void

  searchedFiles: this['files'] | null
  setSearchedFiles: (searchedFiles: this['files'] | null) => void

  iconSize: 1 | 2 | 3 | 4 | 5
  setIconSize: (iconSize: this['iconSize']) => void

  sidebarRef: React.RefObject<HTMLDivElement | null> | null
  contextMenuRef: React.RefObject<HTMLDivElement | null> | null

  contextMenuPosition: { top?: number; bottom?: number; left?: number; width: number, right?: number }
  setContextMenuPosition: (contextMenuPosition: this['contextMenuPosition']) => void
}

export const useStore = create<StoreI>((set) => ({
  // Global states as setter/getter pairs:
  username: 'Loading',
  setUsername: (username) => set(() => ({ username })),

  selectedFiles: [],
  setSelectedFiles: (selectedFiles) => set(() => ({ selectedFiles })),

  clickedItem: undefined,
  setClickedItem: (clickedItem) => set(() => ({ clickedItem })),

  menuState: MenuState.closed,
  setMenuState: (menuState) => set(() => ({ menuState })),

  darkMode: false,
  setDarkMode: (darkMode) => set(() => ({ darkMode })),

  files: [],
  setFiles: (files) => set(() => ({ files })),

  searchedFiles: null,
  setSearchedFiles: (searchedFiles) => set(() => ({ searchedFiles })),

  iconSize:
    (Number(localStorage.getItem('icon-size')) as StoreI['iconSize']) || 3,
  setIconSize: (iconSize) => set(() => ({ iconSize })),

  contextMenuPosition: { top: 0, left: 0, width: 300 },
  setContextMenuPosition: (contextMenuPosition) => set(() => ({ contextMenuPosition })),

  // Refs:
  sidebarRef: createRef(),
  contextMenuRef: createRef()
}))
