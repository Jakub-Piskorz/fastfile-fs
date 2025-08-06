import sidebarStyle from '@/components/Sidebar/Sidebar.module.scss'
import headerStyle from '@/components/Header/Header.module.scss'
import { OverlayState, useStore } from '@/hooks/store'

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
