import style from './PageNotFound.module.css'
import { Link } from 'react-router-dom'
import { Routes } from '@/router/router'

const PageNotFound = () => <div className={style.container}>
  <h1>404</h1>
  <h2>Page not found</h2>
  <Link to={Routes.app}>Return to main page</Link>
</div>

export default PageNotFound