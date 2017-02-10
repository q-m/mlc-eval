import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import store from './store/index'
import { load as loadConfusion } from './store/confusion'
import { load as loadLabels } from './store/labels'

import { Router, Route, browserHistory } from 'react-router'
import App from './components/App'
import Categories from './components/Categories'
import Confusion from './components/Confusion'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'
import 'fixed-data-table/dist/fixed-data-table.css'
import './index.css'

// load initial data
store.dispatch(loadConfusion('/data/data.cm'));
store.dispatch(loadLabels('/data/data.labels'));

ReactDOM.render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='/' component={App}>
        <Route path='categories(/:ida)' component={Categories}>
          <Route path=':idb' component={Categories} />
        </Route>
        <Route path='confusion-matrix' component={Confusion} />
      </Route>
    </Router>
  </Provider>),
  document.getElementById('root')
);
