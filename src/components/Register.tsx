import HtmlHead from '@/scripts/HtmlHead'
import style from './LandingPage.module.scss'

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
import fastfileReverse from '@/images/logo/FastFile-reverse.png'

const Register = (props: any) => {
  return (
    <>
      <HtmlHead title="FastFile | Sign Up" />
      {/* <!-- ? Header ? --> */}
      <header className={style.header}>
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
      </header>

      {/* <!-- ? Main ? --> */}
      <main>
        {/* <!-- ? Header ? --> */}
        <section className={`${style.first} ${style.register}`}>
          {/* <!-- ? Login ? --> */}
          <article className={style.login}>
            <h3>Sign up</h3>
            <form action="#" method="post" id={style.registerForm}>
              <input
                type="text"
                name="register"
                id={style.username}
                placeholder="Username"
              />
              <input
                type="email"
                name="email"
                id={style.email}
                placeholder="E-mail"
              />
              <input
                type="password"
                name="password"
                id={style.password}
                placeholder="Password"
              />
              <input
                type="password"
                name="password2"
                id={style.password2}
                placeholder="Confirm password"
              />
              <label className={style['form__wrapper']}>
                <input type="submit" value="Sign Up" id={style.submit} />
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
          <footer className={style.short}>
            <p>2020 FastFile Inc. All rights reserved.</p>
            <p>
              <a href="#">Privacy Policy</a>
              <span> | </span>
              <a href="#">Terms & Conditions</a>
              <span> | </span>
              <a href="#">Cookies</a>
            </p>
          </footer>
        </section>
      </main>
    </>
  )
}

export default Register
