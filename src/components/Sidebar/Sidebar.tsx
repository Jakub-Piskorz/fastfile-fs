import folder from '@/images/folder.svg'
import share from '@/images/share.svg'
import camera from '@/images/camera.svg'
import code from '@/images/code.svg'
import style from './Sidebar.module.css'
import { useStore } from '@/hooks/store'
import { routes, useCurrentRoute } from '@/router/router'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  const { username, sidebarRef } = useStore()
  const currentRoute = useCurrentRoute()

  return (
    <main className={style.sidebar} ref={sidebarRef}>
      <div className={style.menu}>
        <Link to={routes.app} className={currentRoute === routes.app ? style.red : undefined}>
          <img src={folder} alt="folder" />
          {username}
        </Link>
        <Link to={routes.shared} className={currentRoute === routes.shared ? style.red : undefined}>
          <img src={share} alt="share" />
          Files I share
        </Link>
        <Link to={routes.sharedWithMe} className={currentRoute === routes.sharedWithMe ? style.red : undefined}>
          <img src={share} alt="share" />
          Shared with me
        </Link>
        <Link to={routes.app}>
          <img src={camera} alt="camera" />
          Photos
        </Link>
        <Link to={routes.app}>
          <img src={code} alt="code" />
          Code hosting
          <i className="lock"></i>
        </Link>
      </div>
    </main>
  )
}

export default Sidebar
