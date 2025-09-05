import folder from '@/images/folder.svg'
import share from '@/images/share.svg'
import plusCircle from '@/images/plus-circle.svg'
import camera from '@/images/camera.svg'
import code from '@/images/code.svg'
import style from './Sidebar.module.scss'
import { useStore } from '@/hooks/store'
import { useEffect } from 'react'

const Sidebar = () => {
  const { username, sidebarRef, moduleSelected, setModuleSelected } = useStore()

  return (
    <main className={style.sidebar} ref={sidebarRef}>
      <ul className={style.menu}>
        <li
          className={moduleSelected === 0 ? style.red : undefined}
          onClick={() => setModuleSelected(0)}
        >
          <img src={folder} />
          {username}
        </li>
        <li
          className={moduleSelected === 1 ? style.red : undefined}
          onClick={() => setModuleSelected(1)}
        >
          <img src={share} />
          Shared
        </li>
        <li
          className={moduleSelected === 2 ? style.red : undefined}
          onClick={() => setModuleSelected(2)}
        >
          <img src={plusCircle} />
          Latest files
        </li>
        <li
          className={moduleSelected === 3 ? style.red : undefined}
          onClick={() => setModuleSelected(3)}
        >
          <img src={camera} />
          Photos
        </li>
        <li
          className={moduleSelected === 4 ? style.red : undefined}
          onClick={() => setModuleSelected(4)}
        >
          <img src={code} />
          Code hosting
          <i className="lock"></i>
        </li>
      </ul>
    </main>
  )
}

export default Sidebar
