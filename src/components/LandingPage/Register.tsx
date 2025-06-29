import HtmlHead from '@/scripts/HtmlHead'
import style from './LandingPage.module.scss'

import facebookRoundIcon from '@/images/icons/facebook-round-icon.png'
import githubRoundedIcon from '@/images/icons/github-rounded-icon.png'
import googleRoundedIcon from '@/images/icons/google-rounded-icon.png'
import LpHeader from './LpHeader'
import { useEffect, useRef } from 'react'
import API from '@/scripts/API'
import { Redirect, useHistory } from 'react-router-dom'

const Register = () => {
  const formRef = useRef<HTMLFormElement>(null)
  let history = useHistory()

  useEffect(() => {
    const form = formRef.current
    if (!form) return

    const onSubmit = async (e: SubmitEvent) => {
      e.preventDefault()
      if (e.target == null) throw new Error("Form element doesn't exist.")
      const formData = new FormData(e.target as HTMLFormElement)
      if (formData.get('password') !== formData.get('password2'))
        throw new Error('Passwords are not identical')
      const data = {
        username: formData.get('username'),
        email: formData.get('email'),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        password: formData.get('password'),
      }
      console.log(data)
      API.register(data).then(() => history.push('/'))
    }

    form.addEventListener('submit', onSubmit)
  }, [])

  return (
    <>
      <HtmlHead title="FastFile | Sign Up" />
      <LpHeader />

      {/* <!-- ? Main ? --> */}
      <main>
        {/* <!-- ? Header ? --> */}
        <section className={`${style.first} ${style.register}`}>
          {/* <!-- ? Login ? --> */}
          <article className={style.login}>
            <h3>Sign up</h3>
            <form
              ref={formRef}
              action="#"
              method="post"
              id={style.registerForm}
            >
              <input
                type="text"
                name="username"
                id={style.username}
                placeholder="Username"
              />
              <input
                type="text"
                name="firstName"
                id={style.username}
                placeholder="First name"
              />
              <input
                type="text"
                name="lastName"
                id={style.username}
                placeholder="Last name"
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
