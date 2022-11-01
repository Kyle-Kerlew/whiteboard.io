import {Button, TextField} from '@mui/material';
import {Formik} from 'formik';
import React from 'react';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {UserController} from '../../handlers/rest/userController';
import {loginUser} from '../../reducers/userReducer';
import '../../styles/sign-in.css';

function SignIn() {

    const history = useHistory();
    const dispatch = useDispatch();

    async function handleSignIn(formValues) {
        const values = Object.assign({}, formValues)
        try {
            values.password = btoa(values.password);
            const response = await UserController.signIn(values);
            dispatch(loginUser(response.email));
            history.push('/');
        } catch (e) {
            console.log("Incorrect password.", e);
            alert('Incorrect Password');
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
                                   name="username" label="Username" required/>
                        <TextField type="password" value={values.password} onBlur={onBlur} onChange={handleChange}
                                   name="password" label="Password" required/>

                        <Button type="submit" variant="contained">Sign In</Button>
                        <p>Don't have an account? Create one <a href="/create-account">here</a></p>
                    </form>
                )}</Formik>
        </div>
    )
}

export default SignIn;
