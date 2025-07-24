import { create } from 'zustand'

export enum MenuState {
  closed = 'closed',
  file = 'file',
  directory = 'directory',
  profile = 'profile',
  upload = 'upload',
  background = 'background',
  newDir = 'newDir',
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
  searchedFiles: this['files'] | null
  setSearchedFiles: (searchedFiles: this['files'] | null) => void
}

export const useStore = create<StoreI>()((set) => ({
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
  searchedFiles: null,
  setSearchedFiles: (searchedFiles) => set(() => ({ searchedFiles })),
}))
