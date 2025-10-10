import style from './404.module.css'
import { Link } from 'react-router-dom'
import { routes } from '@/router/router'

const PageNotFound = () => <div className={style.container}>
  <h1>404</h1>
  <h2>Page not found</h2>
  <Link to={routes.app}>Return to main page</Link>
</div>

export default PageNotFound