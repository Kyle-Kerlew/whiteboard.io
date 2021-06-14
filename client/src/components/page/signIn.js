import React from 'react';
import {Button, TextField} from "@material-ui/core";
import '../../styles/sign-in.css';
import UserHandler from "../../handlers/rest/userHandler";

function SignIn() {
    function handleSignIn(e) {
        e.preventDefault();
        UserHandler.signIn(e.target.elements);
    }

    return (
        <div className="container">
            <form className="form" onSubmit={handleSignIn}>
                <TextField type="text" label="Username"/>
                <TextField type="password" label="Password"/>
                <Button type="submit" variant="contained">Sign In</Button>
                <p>Don't have an account? Create one <a href="/create-account">here</a></p>
            </form>
        </div>
    )
}

export default SignIn;