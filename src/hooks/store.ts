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
  setUsername: (newUsername: StoreI['username']) =>
    set(() => ({ username: newUsername })),
  selectedItems: [],
  setSelectedItems: (newSelectedItems) =>
    set(() => ({
      selectedItems: newSelectedItems,
    })),
  clickedItem: undefined,
  setClickedItem: (newClickedItem) =>
    set(() => ({
      clickedItem: newClickedItem,
    })),
  menuState: 'closed',
  setMenuState: (newMenuState) =>
    set(() => ({
      menuState: newMenuState,
    })),
  darkMode: false,
  setDarkMode: (newDarkMode) => set(() => ({ darkMode: newDarkMode })),
}))
