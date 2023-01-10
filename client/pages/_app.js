import React from 'react';
import Layout from "../components/layout";
import "../styles/globals.css";
import 'bootstrap/dist/css/bootstrap.css'

import Head from "next/head";
import NavBar from "../components/navigation/NavBar";
import {wrapper} from "../configuration/store";

function App({Component, pageProps}) {
    return (
        <Layout>
            <Head>
                <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1.0"/>
                <meta name="apple-mobile-web-app-capable" content="yes"/>
            </Head>
                <NavBar/>
                <Component {...pageProps}/>
        </Layout>
    );
}

export default wrapper.withRedux(App);
