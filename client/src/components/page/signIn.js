import React from 'react';
import {Button, TextField} from "@material-ui/core";
import '../../styles/sign-in.css';
import {UserController} from "../../handlers/rest/userController";
import {Formik} from "formik";

function SignIn() {
    async function handleSignIn(user) {
        try {
            user.password = btoa(user.password);
            await UserController.signIn(user);
            console.log("Successfully logged in.")
        } catch (e) {
            console.log("Incorrect password.", e);
        }
    }

    return (
        <div className="container">
            <Formik
                initialValues={{email: '', password: ''}}
                onSubmit={handleSignIn}
            >
                {({handleSubmit, values, errors, handleChange, onBlur, isSubmitting}) => (
                    <form className="form" onSubmit={handleSubmit}>
                        <TextField type="email" value={values.email} onBlur={onBlur} onChange={handleChange}
                                   name="email" label="Email"/>
                        <TextField type="password" value={values.password} onBlur={onBlur} onChange={handleChange}
                                   name="password" label="Password"/>

                        <Button type="submit" variant="contained">Sign In</Button>
                        <p>Don't have an account? Create one <a href="/create-account">here</a></p>
                    </form>
                )}</Formik>
        </div>
    )
}

export default SignIn;