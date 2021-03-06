import React from 'react';
import {Button, TextField} from "@material-ui/core";
import '../../styles/sign-in.css';
import {UserController} from "../../handlers/rest/userController";
import {Formik} from "formik";
import {useHistory} from "react-router-dom";
import {useDispatch} from 'react-redux';
import {loginUser} from "../../reducers/userReducer";

function SignIn() {

    const history = useHistory();
    const dispatch = useDispatch();

    async function handleSignIn(formValues) {
        try {
            formValues.password = btoa(formValues.password);
            const response = await UserController.signIn(formValues);
            dispatch(loginUser(response.email));
            history.push('/');
        } catch (e) {
            console.log("Incorrect password.", e);
            //TODO: toasst
        }
    }

    return (
        <div className="container">
            <Formik
                initialValues={{username: '', password: ''}}
                onSubmit={handleSignIn}
            >
                {({handleSubmit, values, handleChange, onBlur}) => (
                    <form className="form" onSubmit={handleSubmit}>
                        <TextField type="username" value={values.username} onBlur={onBlur} onChange={handleChange}
                                   name="username" label="Username"/>
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