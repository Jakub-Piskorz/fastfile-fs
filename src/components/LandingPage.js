import HtmlHead from '@/scripts/HtmlHead'
import style from './LandingPage.module.scss'
import { useEffect } from 'react'
import API from '@/scripts/API'
import CookieScripts from '@/scripts/cookie-scripts'
import CookieWarning from './CookieWarning'

//A lot of images. Skip to line 37.
import camera from '@/images/graphics/camera.svg'
import code from '@/images/graphics/code.svg'
import folder from '@/images/graphics/folder.svg'
import jpg from '@/images/graphics/jpg.svg'
import key from '@/images/graphics/key.svg'
import mp3 from '@/images/graphics/mp3.svg'
import pdf from '@/images/graphics/pdf.svg'
import plusCircle from '@/images/graphics/plus-circle.svg'
import search from '@/images/graphics/search.svg'
import share from '@/images/graphics/share.svg'
import userGroup from '@/images/graphics/user-group.svg'
import appStoreBtn from '@/images/icons/app-store-btn.png'
import facebookIcon from '@/images/icons/facebook-icon.png'
import facebookRoundIcon from '@/images/icons/facebook-round-icon.png'
import githubRoundedIcon from '@/images/icons/github-rounded-icon.png'
import googleRoundedIcon from '@/images/icons/google-rounded-icon.png'
import linkedInIcon from '@/images/icons/linkedin-icon.png'
import playStoreBtn from '@/images/icons/play-store-btn.png'
import securityIcon from '@/images/icons/security-icon.png'
import shape1 from '@/images/icons/shape1.svg'
import shape2 from '@/images/icons/shape2.svg'
import twitterIcon from '@/images/icons/twitter-icon.png'
import ytIcon from '@/images/icons/yt-icon.png'
import fastfileBlack from '@/images/logo/FastFile-black.jpg'
import fastfileMockup from '@/images/logo/FastFile-mockup.jpg'
import fastfileReverse from '@/images/logo/FastFile-reverse.png'
import fastfileReverse2 from '@/images/logo/FastFile-reverse.jpg'
import fastfileWeb from '@/images/logo/FastFile-web.png'
import fastfile from '@/images/logo/FastFile.jpg'
import fastfile2 from '@/images/logo/FastFile.png'
import securityImage from '@/images/icons/security.jpg'

const LandingPage = (props) => {
  const login = (e) => {
    e.preventDefault()
    const username = document.querySelector('#' + style.username).value
    const password = document.querySelector('#' + style.password).value
    API.login(username, password).then((result) => {
      CookieScripts.add('token', result.token)
      if (CookieScripts.value) window.location.href = '/'
    })
  }

  return (
    <>
      <HtmlHead title="FastFile | Home" />
      <CookieWarning />
      {/* <!-- ? Header ? --> */}
      <header className={style.header}>
        <div className={style.widthMain}>
          <img src={fastfileReverse} alt="FastFile" className={style.logo} />
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
                <a href="#">Sign In</a>
              </li>
              <li className={style.button}>
                <a href="#">Sign Up</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* <!-- ? Main ? --> */}
      <main>
        {/* <!-- ? Header ? --> */}
        <section className={style.first}>
          <div className={style.widthMain}>
            <div className={style.flexWrapper}>
              <div className={style['header__wrapper']}>
                <h1>
                  <span className={style['main__header__h2']}>Send Files</span>{' '}
                  Everywhere
                </h1>

                {/* <!-- ? Begin ? --> */}
                <article className={style.begin}>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Facere ipsa quas placeat amet. Sequi dolore hic doloremque
                    blanditiis atque repudiandae laudantium non a deleniti quam
                    excepturi magni, voluptatem rem quod earum repellendus
                    pariatur.
                  </p>
                </article>
              </div>
              {/* <!-- ? Login ? --> */}
              <article className={style.login}>
                <h3>User Login</h3>
                <form action="#" method="post" id={style.loginForm}>
                  <input
                    type="text"
                    name="username"
                    id={style.username}
                    placeholder="Username"
                  />
                  <input
                    type="password"
                    name="password"
                    id={style.password}
                    placeholder="Password"
                  />
                  <label className={style.form__wrapper}>
                    <input
                      type="submit"
                      value="Sign In"
                      id={style.submit}
                      onClick={login}
                    />
                    <button type="button" id={style['login__sign_up']}>
                      Sign Up
                    </button>
                  </label>
                </form>

                <p>Or sign up with another account</p>

                <div className={style['login__another_login__wrapper']}>
                  <a href="#">
                    <img src={googleRoundedIcon} alt="Google" />
                  </a>
                  <a href="#" className={style.facebook}>
                    <img src={facebookRoundIcon} alt="Facebook" />
                  </a>
                  <a href="#">
                    <img src={githubRoundedIcon} alt="GitHub" />
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* <!-- ? Secure ? --> */}
        <section className={style.secure}>
          <div className={style.widthMain}>
            <div className={style['secure__wrapper']}>
              <h2>
                Keep Your <span>Data Secure</span>
              </h2>
              <h3>
                On All Of Your <span>Devices</span>
              </h3>
              <img
                src={securityIcon}
                alt="secure"
                className={style['security_icon']}
              />
              <img
                src={securityImage}
                alt="secure your device"
                className={style['secure-icon']}
              />
              <div className={style['secure__text__wrapper']}>
                <p>
                  FastFile will give you full control over your most vulnerable
                  data, that you can access all around the world
                </p>
                <p>
                  Login through this website or download the App from App Store
                  / Google Play
                </p>
              </div>
              <div className={style['secure__store__wrapper']}>
                <a href="#">
                  <img
                    src={appStoreBtn}
                    alt="App Store"
                    className={style.store}
                  />
                </a>
                <a href="#">
                  <img
                    src={playStoreBtn}
                    alt="Google Play"
                    className={style.store}
                  />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* <!-- ? Aside ? --> */}
      <aside>
        <div id={style.menu}>
          <div className={style.dash}></div>
          <div className={style.dash}></div>
          <div className={style.dash}></div>
        </div>
      </aside>

      {/* <!-- ? Footer ? --> */}
      <footer>
        <div className={style.widthMain}>
          <img className={style.logo} src={fastfileReverse} alt="" />
          <div className={style['footer__wrapper']}>
            <article className={style['about_us']}>
              <h3>About Us</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
                aperiam odio officia unde iste laudantium saepe quisquam in et
                tenetur dicta, cupiditate illum, vero reprehenderit eius
                corrupti id quos voluptate, voluptas incidunt numquam ut.
              </p>
            </article>
            <article className={style['quick_links']}>
              <h3>Quick Links</h3>
              <nav className={style['nav__footer']}>
                <ul>
                  <li>
                    <a href="#">Login</a>
                  </li>
                  <li>
                    <a href="#">Career</a>
                  </li>
                  <li>
                    <a href="#">Press</a>
                  </li>
                  <li>
                    <a href="#">Code of Conduct</a>
                  </li>
                  <li>
                    <a href="#">Documentation</a>
                  </li>
                </ul>
              </nav>
            </article>
            <article className={style['footer__follow_us']}>
              <h3>Follow us</h3>
              <a href="#">
                <img src={facebookIcon} alt="Facebook" />
              </a>
              <a href="#">
                <img src={ytIcon} alt="YouTube" />
              </a>
              <a href="#">
                <img src={linkedInIcon} alt="LinkedIn" />
              </a>
              <a href="#">
                <img src={twitterIcon} alt="Twitter" />
              </a>
            </article>
          </div>
          <article className={style.end}>
            <h2>2020 FastFile Inc. All rights reserved.</h2>
            <div className={style['end__wrapper']}>
              <a href="#">Privacy Policy</a>
              <span> | </span>
              <a href="#">Terms & Conditions</a>
              <span> | </span>
              <a href="#">Cookies</a>
            </div>
          </article>
          <div className={style.triangle}>
            <img src={shape1} alt="shape 1" className={style.shape_1} />
            <img src={shape2} alt="shape 2" className={style.shape_2} />
          </div>
        </div>
      </footer>
    </>
  )
}

export default LandingPage
