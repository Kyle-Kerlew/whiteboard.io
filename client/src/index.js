import React from 'react';
import ReactDOM from 'react-dom';
import './styles/globals.css'
import {BrowserRouter} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Router from "./components/routing/router";

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Router/>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);