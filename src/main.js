import React from 'react'
import ReactDOM from 'react-dom'
import Main from '@/components/Main.jsx'
import './style.scss'

ReactDOM.render(<Main />, document.getElementById('app'))

if (module.hot) {
  // enables hot module replacement if plugin is installed
  module.hot.accept()
}
