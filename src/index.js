import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import store from './store/index'
import { load as loadConfusion } from './store/confusion'
import { load as loadLabels } from './store/labels'
import { load as loadModel } from './store/model'

import { IndexRoute, Router, Route, hashHistory } from 'react-router'
import App from './components/App'
import Summary from './components/Summary'
import Categories from './components/Categories'
import Confusion from './components/Confusion'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'
import 'fixed-data-table/dist/fixed-data-table.css'
import './index.css'

// load initial data
// @todo move to more appropriate location
function loadDefault() {
  let baseUrl = (process.env.PUBLIC_URL || '') + '/example/iris';
  if (window.location.search.startsWith('?baseUrl=')) {
    baseUrl = window.location.search.slice(10);
  }

  store.dispatch(loadConfusion(baseUrl + '.cm'));
  store.dispatch(loadLabels(baseUrl + '.labels'));
  store.dispatch(loadModel(baseUrl + '.model'));
}
loadDefault();


ReactDOM.render((
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path='/' component={App}>
        <IndexRoute component={Summary} />
        <Route path='categories(/:ida)' component={Categories}>
          <Route path=':idb' component={Categories} />
        </Route>
        <Route path='confusion-matrix' component={Confusion} />
      </Route>
    </Router>
  </Provider>),
  document.getElementById('root')
);
