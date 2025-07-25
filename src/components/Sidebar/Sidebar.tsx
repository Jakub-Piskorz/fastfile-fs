import folder from '@/images/folder.svg'
import share from '@/images/share.svg'
import plusCircle from '@/images/plus-circle.svg'
import camera from '@/images/camera.svg'
import code from '@/images/code.svg'
import style from './Sidebar.module.scss'
import { useStore } from '@/hooks/store'
import { useEffect } from 'react'

const Sidebar = () => {
  const { username, sidebarRef } = useStore()

  return (
    <main className={style.sidebar} ref={sidebarRef}>
      <ul className={style.menu}>
        <li className={style.red}>
          <img src={folder} />
          {username}
        </li>
        <li>
          <img src={share} />
          Shared
        </li>
        <li>
          <img src={plusCircle} />
          Latest files
        </li>
        <li>
          <img src={camera} />
          Photos
        </li>
        <li>
          <img src={code} />
          Code hosting
          <i className="lock"></i>
        </li>
      </ul>
    </main>
  )
}

export default Sidebar
