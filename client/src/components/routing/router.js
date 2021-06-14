import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Home from "../toolbar/home";
import Canvas from "../drawing/canvas";
import CreateAccount from "../page/createAccount";
import SignIn from "../page/signIn";

function Router() {
    return (
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/sign-in" component={SignIn}/>
            <Route path="/create-account" component={CreateAccount}/>
            <Route path="/:canvasId" component={Canvas}/>
        </Switch>
    )
}

export default Router;