import styles from './Loading.module.css'
import fastfileLogo from '@/images/logo/FastFile-web.png'

export default function Loading() {


  return <div id={styles.loadingPage}>
    <img className={styles.logo} src={fastfileLogo} alt="Fastfile logo" />
    <div>Loading...<br />
    </div>
  </div>
}