import sidebarStyle from '@/components/Sidebar/Sidebar.module.css'
import headerStyle from '@/components/Header/Header.module.css'
import { useStore } from '@/hooks/store'
import OverlayState from '@/types/OverlayStateEnum'

const useToggleNav = () => {
  const { overlay, setOverlay, sidebarRef } = useStore()

  return () => {
    const sidebarEl = sidebarRef.current

    setOverlay(
      overlay === OverlayState.hidden
        ? OverlayState.sidebar
        : OverlayState.hidden
    )
    document
      .querySelector('.' + headerStyle['nav-button'])
      .classList.toggle(headerStyle.open)
    sidebarEl.classList.toggle(sidebarStyle.show)
  }
}

export default useToggleNav
