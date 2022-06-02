import React from "react";
import ReactDOM from "react-dom";
import App from './App';
import './index.css';

//redux 
import { PersistGate } from 'redux-persist/integration/react';
import {Store,presistStore} from '../src/redux/store';
import { Provider } from 'react-redux';

ReactDOM.render(
    <Provider store={Store}>
        <PersistGate loading={null} persistor={presistStore}>
            <App />
        </PersistGate>
    </Provider>
    ,

    document.getElementById('root'))