import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Popover from "../toolbar/popover";
import Canvas from "../drawing/canvas";

function Router() {
    return (
        <Switch>
            <Route exact path="/" component={Popover}/>
            <Route path="/:canvasId" component={Canvas}/>
        </Switch>
    )
}

export default Router;