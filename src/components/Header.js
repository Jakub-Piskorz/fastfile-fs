import toggleNav from '@/scripts/toggle-nav.js'
import logo from '@/images/logo.png'
import profilePic from '@/images/trump.png'
import style from '@/style.module.scss'

const Header = (props) => {
  return (
    <header className={style.header}>
      <div id={style.left}>
        <div className={style.hamwrapper}>
          <div className={style.hamburger}></div>
        </div>

        <a href="/">
          <img src={logo} title="FastFile" alt="FastFile" />
        </a>
      </div>
      <div id={style.mid}>
        <div className={style['nav-button']} onClick={toggleNav}>
          <i className={style['nav-icon']}></i>
        </div>
        <div id={style['text-wrapper']}>
          <input type="text" placeholder="Search something..." />
        </div>
      </div>
      <img id={style.right} src={profilePic} />
    </header>
  )
}

export default Header
