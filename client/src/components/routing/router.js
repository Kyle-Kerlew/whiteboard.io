import React, {useState} from 'react';
import {Switch, Route} from 'react-router-dom';
import Home from "../page/home";
import Canvas from "../drawing/canvas";
import CreateAccount from "../page/createAccount";
import SignIn from "../page/signIn";
import BoardList from "../drawing/boardList";
import NavBar from "../navigation/navBar";
import UserContext from "../context/userContext";
import {UserController} from '../../handlers/rest/userController';

function Router() {
    const [user, setUser] = useState({
        authenticated: false
    });

    function checkAuthentication() {
        if (document.cookie.includes('session-id')) {
            //todo: Is this a bad idea?
            console.log("Authenticated call")
            setUser(prevState => {
                prevState.authenticated = true;
                return prevState;
            });
        }
    }

    function login() {
        setUser({
            authenticated: true
        });
    }

    function logout(authenticatedUser) {
        setUser({authenticated: false});
        UserController.signOut()
    }

    return (
        <UserContext.Provider value={{user, login, logout, checkAuthentication}}>
            <NavBar/>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route path="/sign-in" component={SignIn}/>
                <Route path="/create-account" component={CreateAccount}/>
                <Route path="/my-boards" component={BoardList}/>
                <Route path="/boards/:canvasId" component={Canvas}/>
            </Switch>
        </UserContext.Provider>
    )
}

export default Router;