import React, {useEffect, useState} from 'react';
import {Switch, Route} from 'react-router-dom';
import Home from "../page/home";
import Canvas from "../drawing/canvas";
import CreateAccount from "../page/createAccount";
import SignIn from "../page/signIn";
import BoardList from "../drawing/boardList";
import NavBar from "../navigation/navBar";
import {UserController} from "../../handlers/rest/userController";
import {finishLoadingUser, loginUser, logoutUser} from "../../reducers/userReducer";
import {useDispatch} from "react-redux";

function Router() {
    const dispatch = useDispatch();

    (async function isAuthenticated() {
        try {
            const response = await UserController.getUserDetailsByCookie();
            dispatch(loginUser(response.email));
        } catch (e) {
            dispatch(logoutUser());
        }
        dispatch(finishLoadingUser());
    })();
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