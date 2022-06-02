import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import Reducer from './reducers';

const rootReducer = combineReducers({ Reducer });
export const Store = createStore(rootReducer, applyMiddleware(thunk))