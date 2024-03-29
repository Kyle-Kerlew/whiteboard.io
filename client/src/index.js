import React from 'react';
import ReactDOM from 'react-dom';
import {
  Provider,
} from 'react-redux';
import {
  BrowserRouter,
} from 'react-router-dom';
import Router from './components/routing/router';
import store from './configuration/store';
import './styles/globals.css';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.querySelector('#root'),
);
