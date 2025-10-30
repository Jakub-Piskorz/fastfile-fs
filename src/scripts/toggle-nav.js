import sidebarStyle from '@/components/Sidebar/Sidebar.module.css'
import headerStyle from '@/components/Header/Header.module.css'
import { useStore } from '@/hooks/store'
import OverlayState from '@/types/OverlayStateEnum'

const useToggleNav = () => {
  const { overlay, setOverlay, sidebarRef } = useStore()

  return (close = false) => {
    const sidebarEl = sidebarRef.current
    const navBtnEl = document.querySelector('.' + headerStyle['nav-button'])

    if (close === true) {
      setOverlay(OverlayState.hidden)
      navBtnEl.classList.remove(headerStyle.open)
      sidebarEl.classList.remove(sidebarStyle.show)
    } else {
      setOverlay(
        overlay === OverlayState.hidden
          ? OverlayState.sidebar
          : OverlayState.hidden
      )
      navBtnEl.classList.toggle(headerStyle.open)
      sidebarEl.classList.toggle(sidebarStyle.show)
    }
  }
}

export default useToggleNav
