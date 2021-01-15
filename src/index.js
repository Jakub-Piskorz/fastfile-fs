import ReactDOM from 'react-dom'
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

ReactDOM.render(
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
      {/* Remove TEST before publishing!!! */}
      <Route exact path="/test123" component={Test} />
    </Switch>
  </Router>,
  document.getElementById('app')
)

if (module.hot) {
  // enables hot module replacement if plugin is installed
  module.hot.accept()
}
