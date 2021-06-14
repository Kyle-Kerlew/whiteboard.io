import React from 'react';
import {Button, TextField} from "@material-ui/core";
import UserHandler from "../../handlers/rest/userHandler";

function CreateAccount() {

    function handleCreateAccount(e) {
        e.preventDefault();
        UserHandler.createAccount(e.target.elements);
    }

    return (
        <div className="container">
            <form className="form" onSubmit={handleCreateAccount}>
                <TextField type="text" label="Email"/>
                <TextField type="password" label="Password"/>
                <TextField type="password" label="Matching Password"/>
                <Button type="submit" variant="contained">Create Account</Button>
                <p>Already have an account? Sign in <a href="/sign-in">here</a></p>
            </form>
        </div>
    )
}

export default CreateAccount;