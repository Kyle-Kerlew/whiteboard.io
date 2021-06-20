import React, {useState} from 'react';
import {Switch, Route} from 'react-router-dom';
import Home from "../page/home";
import Canvas from "../drawing/canvas";
import CreateAccount from "../page/createAccount";
import SignIn from "../page/signIn";
import BoardList from "../drawing/boardList";
import NavBar from "../navigation/navBar";
import UserContext from "../context/userContext";
function Router() {
    const [user, setUser] = useState();

    function login() {
        console.log("login worked")
        setUser({
            user: {
                isAuthenticated: true
            }
        });
    }

    function logout(authenticatedUser) {
        setUser({user: {}});
    }

    return (
        <UserContext.Provider value={{user, login, logout}}>
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