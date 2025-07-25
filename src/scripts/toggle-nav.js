import sidebarStyle from '@/components/Sidebar/Sidebar.module.scss'
import filesStyle from '@/components/Files/Files.module.scss'
import headerStyle from '@/components/Header/Header.module.scss'
import { useStore } from '@/hooks/store'

const useToggleNav = () => {
  const { sidebarRef } = useStore()

  return () => {
    const sidebarEl = sidebarRef.current

    sidebarEl.classList.toggle(sidebarStyle.show)
    document
      .querySelector('.' + filesStyle['sidebar-mask'])
      .classList.toggle(filesStyle.hidden)
    document
      .querySelector('.' + headerStyle['nav-button'])
      .classList.toggle(headerStyle.open)
  }
}

export default useToggleNav
