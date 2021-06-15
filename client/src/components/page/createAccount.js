import React from 'react';
import {Button, TextField} from "@material-ui/core";
import {UserHandler} from "../../handlers/rest/userHandler";
import {ErrorMessage, Formik} from "formik";
import * as Yup from 'yup';

function CreateAccount() {

    async function handleCreateAccount(values) {
        delete values.matchingPassword; //TODO: find a better way to remove this field?
        values.password = btoa(values.password);
        try {
            await UserHandler.createAccount(values);
            //Move user to their documents page
        } catch (e) {
        }
    }

    const CreateAccountSchema = Yup.object().shape({
        firstName: Yup.string()
            .min(2, 'First Name must be more than 1 character.')
            .max(50, 'First Name must be less than 50 characters.')
            .required('First name is required.'),
        lastName: Yup.string()
            .min(2, 'Last name must be more than 1 character.')
            .max(50, 'Last name must be less than 50 characters.')
            .required('Last name is required.'),
        email: Yup.string().email('The email provided is invalid.').required('Email is required.'),
        password: Yup.string().min(7, 'Password must be at least 7 characters.').required('Password is a required field.'),
        matchingPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match.')
    });

    return (
        <div className="container">
            <Formik
                initialValues={{email: '', password: '', matchingPassword: ''}}
                onSubmit={handleCreateAccount}
                validationSchema={CreateAccountSchema}
            >
                {({handleSubmit, values, errors, handleChange, onBlur, isSubmitting}) => (
                    <form className="form" onSubmit={handleSubmit}>
                        <TextField
                            type="string"
                            required
                            onChange={handleChange}
                            onBlur={onBlur}
                            value={values.firstName}
                            name="firstName"
                            label="First Name"
                        />
                        <TextField
                            type="string"
                            required
                            onChange={handleChange}
                            onBlur={onBlur}
                            value={values.lastName}
                            name="lastName"
                            label="Last Name"
                        />
                        <TextField
                            type="email"
                            required
                            onChange={handleChange}
                            onBlur={onBlur}
                            value={values.email}
                            name="email"
                            label="Email"
                        />
                        <ErrorMessage name="email"/>
                        <TextField
                            type="password"
                            required
                            onChange={handleChange}
                            onBlur={onBlur}
                            value={values.password}
                            name="password"
                            label="Password"
                        />
                        <ErrorMessage name="password"/>
                        <TextField
                            type="password"
                            onChange={handleChange}
                            required
                            value={values.matchingPassword}
                            name="matchingPassword"
                            label="Matching Password"
                        />
                        <ErrorMessage name="matchingPassword"/>
                        <Button type="submit" variant="contained">Create Account</Button>
                        <p>Already have an account? Sign in <a href="/sign-in">here</a></p>
                    </form>
                )}
            </Formik>
        </div>
    )
}

export default CreateAccount;