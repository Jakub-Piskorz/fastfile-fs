import style from '../../pages/LandingPage/LandingPage.module.css'
import fastfileReverse from '@/images/logo/FastFile-reverse.png'

const LpHeader = () => {
  // noinspection HtmlUnknownTarget
  return (
    <div className={style.widthMain}>
      <header className={style.header}>
        <a href="lp">
          <img src={fastfileReverse} alt="FastFile" className={style.logo} />
        </a>
        <nav className={style.nav}>
          <ul>
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">Docs</a>
            </li>
            <li>
              <a href="#">API</a>
            </li>
            <li className={style.button}>
              <a href="lp">Sign In</a>
            </li>
            <li className={style.button}>
              <a href="register">Sign Up</a>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  )
}

export default LpHeader
