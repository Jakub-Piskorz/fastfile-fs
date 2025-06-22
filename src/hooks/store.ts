import { create } from 'zustand'

interface StoreI {
  username: string
  setUsername: (newUsername: string) => void
  selectedItems: string[]
  setSelectedItems: (newSelectedItems: string[]) => void
  clickedItem?: string
  setClickedItem: (newClickedItem: string) => void
  menuState: 'closed' | 'file' | 'directory' | 'profile' | 'upload'
  setMenuState: (newMenuState: this['menuState']) => void
  darkMode: boolean
  setDarkMode: (newDarkMode: boolean) => void
}

export const useStore = create<StoreI>()((set) => ({
  username: 'Loading',
  setUsername: (username) => set(() => ({ username })),
  selectedItems: [],
  setSelectedItems: (selectedItems) => set(() => ({ selectedItems })),
  clickedItem: undefined,
  setClickedItem: (clickedItem) => set(() => ({ clickedItem })),
  menuState: 'closed',
  setMenuState: (menuState) => set(() => ({ menuState })),
  darkMode: false,
  setDarkMode: (darkMode) => set(() => ({ darkMode })),
}))
