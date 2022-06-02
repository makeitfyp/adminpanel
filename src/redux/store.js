import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import Reducer from './reducer';

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    storage,
  }

const rootReducer = combineReducers({ Reducer });

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const Store = createStore(persistedReducer, applyMiddleware(thunk));
export const presistStore = persistStore(Store);