import { applyMiddleware, combineReducers, createStore } from 'redux'
import thunk from 'redux-thunk'
import { reducer as confusion } from './confusion'
import { reducer as labels } from './labels'
import { reducer as files } from './files'
import { reducer as model } from './model'
import { reducer as config } from './config'
import windowSize, { createRemAction, createSizeAction, listenResize } from 'redux-windowsize'

const reducer = combineReducers({confusion, labels, files, model, config, windowSize});
const store = createStore(reducer, applyMiddleware(thunk));

// Update and watch window size
store.dispatch(createSizeAction(window));
store.dispatch(createRemAction(window));
listenResize(store, window, 100);

export default store;
