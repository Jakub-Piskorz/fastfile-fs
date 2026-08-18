import sidebarStyle from '@/components/Sidebar/Sidebar.module.css'
import headerStyle from '@/components/Header/Header.module.css'
import { useStore } from '@/store/store'
import OverlayState from '@/components/Overlay/OverlayStateEnum'
import { useOverlayStore } from '@/components/Overlay/overlayStore'

const useToggleNav = () => {
  const { sidebarRef } = useStore()
  const { overlay, setOverlay } = useOverlayStore()


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
