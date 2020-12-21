import ReactDOM from 'react-dom'
import App from '@/components/App'
import LandingPage from '@/components/LandingPage'
import Register from '@/components/Register'
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
          /token=(.+);/.test(document.cookie) ? (
            <Redirect to="/" />
          ) : (
            <LandingPage />
          )
        }
      />
      <Route path="/register" component={Register} />
      <Route
        exact
        path="/"
        render={() =>
          /token=(.+);/.test(document.cookie) ? <App /> : <Redirect to="/lp" />
        }
      />
    </Switch>
  </Router>,
  document.getElementById('app')
)

if (module.hot) {
  // enables hot module replacement if plugin is installed
  module.hot.accept()
}
