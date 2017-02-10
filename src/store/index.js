import { applyMiddleware, combineReducers, createStore } from 'redux'
import thunk from 'redux-thunk'
import { reducer as confusion } from './confusion'
import { reducer as labels } from './labels'
import { reducer as files } from './files'
import windowSize, { createRemAction, createSizeAction, listenResize } from 'redux-windowsize'

const reducer = combineReducers({confusion, labels, files, windowSize});
const store = createStore(reducer, applyMiddleware(thunk));

// Update redux with current size.
store.dispatch(createSizeAction(window));
store.dispatch(createRemAction(window));
// Dispatch an action every 100ms when window size changes.
listenResize(store, window, 100);

export default store;
