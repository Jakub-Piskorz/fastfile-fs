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
      <Route path="/lp" component={LandingPage} />
      <Route path="/register" component={Register} />
      <Route exact path="/" component={App} />
    </Switch>
  </Router>,
  document.getElementById('app')
)

if (module.hot) {
  // enables hot module replacement if plugin is installed
  module.hot.accept()
}
