import folder from '@/images/folder.svg'
import share from '@/images/share.svg'
import camera from '@/images/camera.svg'
import code from '@/images/code.svg'
import style from './Sidebar.module.css'
import { useStore } from '@/store/store'
import { Routes, useCurrentRoute } from '@/router/router'
import { Link } from 'react-router-dom'
import useToggleNav from '@/scripts/toggle-nav'

const Sidebar = () => {
  const { username, sidebarRef } = useStore()
  const toggleNav = useToggleNav()
  const currentRoute = useCurrentRoute()

  return (
    <main className={style.sidebar} ref={sidebarRef}>
      <div className={style.menu}>
        <Link to={Routes.app} onClick={() => toggleNav(true)}
              className={currentRoute === Routes.app ? style.red : undefined}>
          <img src={folder} alt="folder" />
          {username}
        </Link>
        <Link to={Routes.shared} onClick={() => toggleNav(true)}
              className={currentRoute === Routes.shared ? style.red : undefined}>
          <img src={share} alt="share" />
          Files I share
        </Link>
        <Link to={Routes.sharedWithMe} onClick={() => toggleNav(true)}
              className={currentRoute === Routes.sharedWithMe ? style.red : undefined}>
          <img src={share} alt="share" />
          Shared with me
        </Link>
        <Link to={Routes.app}>
          <img src={camera} alt="camera" />
          Photos
        </Link>
        <Link to={Routes.app}>
          <img src={code} alt="code" />
          Code hosting
          <i className="lock"></i>
        </Link>
      </div>
    </main>
  )
}

export default Sidebar
