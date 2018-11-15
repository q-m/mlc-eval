import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import store from './store/index'
import { load as loadConfusion } from './store/confusion'
import { load as loadLabels } from './store/labels'
import { load as loadModel } from './store/model'

import { HashRouter as Router, Route } from 'react-router-dom'
import App from './components/App'
import Summary from './components/Summary'
import Categories from './components/Categories'
import Confusion from './components/Confusion'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'
import './index.css'

// load initial data
// @todo move to more appropriate location
function loadDefault() {
  let baseUrl = (process.env.PUBLIC_URL || '') + '/example/iris';
  if (window.location.search.startsWith('?baseUrl=')) {
    baseUrl = decodeURIComponent(window.location.search.slice(9));
  }

  store.dispatch(loadConfusion(baseUrl + '.cm'));
  store.dispatch(loadLabels(baseUrl + '.labels'));
  store.dispatch(loadModel(baseUrl + '.model'));
}
loadDefault();


ReactDOM.render((
  <Provider store={store}>
    <Router>
      <App>
        <Route path='/' exact component={Summary} />
        <Route path='/categories/:ida?/:idb?' component={Categories} />
        <Route path='/confusion-matrix' component={Confusion} />
      </App>
    </Router>
  </Provider>),
  document.getElementById('root')
);
