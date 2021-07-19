import React, {useEffect} from 'react';
import {Switch, Route, useLocation} from 'react-router-dom';
import Home from "../page/home";
import Canvas from "../drawing/canvas";
import CreateAccount from "../page/createAccount";
import SignIn from "../page/signIn";
import BoardList from "../drawing/boardList";
import NavBar from "../navigation/navBar";
import {Authentication as getAuthentication} from "../shared/authentication";
import {useDispatch} from "react-redux";

function Router() {
    const dispatch = useDispatch();
    const location = useLocation()

    useEffect(() => {
        getAuthentication(dispatch)();
    }, [location]);

    return (
        <React.Fragment>
            <NavBar/>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route path="/sign-in" component={SignIn}/>
                <Route path="/create-account" component={CreateAccount}/>
                <Route path="/my-boards" component={BoardList}/>
                <Route path="/boards/:canvasId" component={Canvas}/>
            </Switch>
        </React.Fragment>
    )
}

export default Router;