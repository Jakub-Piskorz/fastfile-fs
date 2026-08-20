import styles from './AuthError.module.css'
import fastfileReverse from '@/images/logo/FastFile-reverse.png'
import Api from '@/api'
import { useEffect } from 'react'
import { Routes } from '@/router/router'
import { useNavigate } from 'react-router-dom'

export default function AuthError() {

  const navigate = useNavigate()

  // Check every 10 seconds if server is back.
  // If server responds, redirect to main page.
  useEffect(() => {
    const interval = setInterval(() => {
      Api.auth.getCurrentUser().then(() => {
        navigate(Routes.app)
      }).catch((ignoredError) => {
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [])


  return <>
    <div id={styles.errorPage}>
      <img className={styles.logo} src={fastfileReverse} alt="" />
      <div>Authentication server is offline.<br />
        Try again later
      </div>
    </div>
  </>
}