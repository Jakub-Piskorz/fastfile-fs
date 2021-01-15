import folder from '@/images/folder.svg'
import share from '@/images/share.svg'
import plusCircle from '@/images/plus-circle.svg'
import camera from '@/images/camera.svg'
import code from '@/images/code.svg'
import style from './App.module.scss'

const Sidebar = (props) => {
  return (
    <main className={style.sidebar}>
      <ul className={style.menu}>
        <li className={style.red}>
          <img src={folder} />
          {props.name}
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
