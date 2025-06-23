import { createRoot } from 'react-dom/client'
import App from '@/components/App'
import LandingPage from '@/components/LandingPage'
import Register from '@/components/Register'
import CookieScripts from '@/scripts/cookie-scripts'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'

const root = createRoot(document.getElementById('app')!)
export const basename = '/fastfile'

if (!window.location.pathname.startsWith(basename))
  window.location.replace(basename)

root.render(
  <Router basename={basename}>
    <Switch>
      <Route
        path="/lp"
        render={() =>
          CookieScripts.value('token') ? <Redirect to="/" /> : <LandingPage />
        }
      />
      <Route path="/register" component={Register} />
      <Route
        exact
        path="/"
        render={() =>
          CookieScripts.value('token') ? <App /> : <Redirect to="/lp" />
        }
      />
    </Switch>
  </Router>
)
