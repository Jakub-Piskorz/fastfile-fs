import { createRef } from 'react'
import { create } from 'zustand'
import MenuState from '@/types/MenuStateEnum'
import { StoreI } from '@/store/store.types'

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

  iconSize:
    (Number(localStorage.getItem('icon-size')) as StoreI['iconSize']) || 3,
  setIconSize: (iconSize) => set(() => ({ iconSize })),

  contextMenuPosition: { top: 0, left: 0, width: 300 },
  setContextMenuPosition: (contextMenuPosition) => set(() => ({ contextMenuPosition })),

  // Refs:
  sidebarRef: createRef(),
  contextMenuRef: createRef()
}))