import React from 'react';
import ReactDOM from 'react-dom';
import './styles/globals.css'
import {BrowserRouter} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Router from "./components/routing/router";
import {Provider} from 'react-redux';
import store from './configuration/store';

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Router/>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);