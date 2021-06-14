import React from 'react';
import ReactDOM from 'react-dom';
import './styles/globals.css'
import App from './App';
import {BrowserRouter} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from "./components/navigation/navbar";

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <NavBar/>
                <App/>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);