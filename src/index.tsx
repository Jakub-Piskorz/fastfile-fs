import { createRoot } from 'react-dom/client'
import App from '@/pages/App/App'
import LandingPage from '@/pages/LandingPage/LandingPage'
import Register from '@/pages/LandingPage/Register'
import CookieScripts from '@/scripts/cookie-scripts'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'

const root = createRoot(document.getElementById('app')!)
export const basename = '/fastfile/'

root.render(
  <Router basename={basename}>
    <Switch>
      <Route
        path={`/lp`}
        render={() =>
          CookieScripts.value('token') ? <Redirect to={`/`} /> : <LandingPage />
        }
      />
      <Route path={`/register`} render={() => <Register />} />
      <Route
        exact
        path={`/`}
        render={() =>
          CookieScripts.value('token') ? <App /> : <Redirect to={`/lp`} />
        }
      />
    </Switch>
  </Router>
)
