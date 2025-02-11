import { createRoot } from 'react-dom/client'
import App from '@/components/App'
import LandingPage from '@/components/LandingPage'
import Register from '@/components/Register'
import CookieScripts from '@/scripts/cookie-scripts'
import Test from '@/components/Test'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
  Redirect,
} from 'react-router-dom'

const root = createRoot(document.getElementById('app')!)

root.render(
  <Router>
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
