import HtmlHead from '@/scripts/HtmlHead'
import style from '@/landing-page.module.scss'

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

const Register = (props) => {
  return (
    <>
      <HtmlHead title="FastFile | Login" />
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
        <section className={`${style.first} ${style.middle}`}>
          {/* <!-- ? Login ? --> */}
          <article className={style.login}>
            <h3>Sign up</h3>
            <form action="#" method="post">
              <input
                type="text"
                name="register"
                id={style['register__register']}
                placeholder="Username"
              />
              <input
                type="email"
                name="email"
                id={style['register__email']}
                placeholder="Username"
              />
              <input
                type="password"
                name="password"
                id={style['register__password']}
                placeholder="Password"
              />
              <input
                type="password"
                name="password2"
                id={style['register__password2']}
                placeholder="Confirm password"
              />
              <label className={style['form__wrapper']}>
                <input
                  type="submit"
                  value="Sign Up"
                  id={style['login__submit']}
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
          <article className={style.end}>
            <p>2020 FastFile Inc. All rights reserved.</p>
            <p>
              <a href="#">Privacy Policy</a>
              <span> | </span>
              <a href="#">Terms & Conditions</a>
              <span> | </span>
              <a href="#">Cookies</a>
            </p>
          </article>
        </section>
      </main>
    </>
  )
}

export default Register
