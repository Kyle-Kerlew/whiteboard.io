import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Home from "../toolbar/home";
import Canvas from "../drawing/canvas";

function Router() {
    return (
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/:canvasId" component={Canvas}/>
        </Switch>
    )
}

export default Router;