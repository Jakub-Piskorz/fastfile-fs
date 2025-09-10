import { useStore, MenuState } from './store'

const useFileClick = () => {
  const { setMenuState, menuState, setClickedItem, contextMenuRef } = useStore()

  return (e: React.MouseEvent, type: 'file' | 'background' | 'directory') => {
    console.log(type)
    e.preventDefault()
    e.stopPropagation()
    const contextMenu: HTMLElement | null = contextMenuRef?.current || null
    if (!contextMenu) {
      console.error(`contextMenu HTML Element returns null in Files.tsx`)
      return
    }
    // Is right click?
    if (e.nativeEvent.button === 2) {
      const posX = e.nativeEvent.clientX
      const posY = e.nativeEvent.clientY
      contextMenu.style.top = `${Math.min(posY, window.innerHeight - 70)}px`
      contextMenu.style.left = `${Math.min(posX, window.innerWidth - 200)}px`
      contextMenu.style.right = ``
      if (type === 'file') {
        setClickedItem(e.currentTarget.children[1].innerHTML)
        setMenuState(MenuState.file)
      } else if (type === 'background') {
        setMenuState(MenuState.background)
      } else if (type === 'directory') {
        setClickedItem(e.currentTarget.children[1].innerHTML)
        setMenuState(MenuState.directory)
      }
    } else {
      if (menuState !== MenuState.closed) setMenuState(MenuState.closed)
    }
  }
}

export default useFileClick
