import {
  TextField,
} from '@mui/material';
import {
  ErrorMessage,
  Formik,
} from 'formik';
import React from 'react';
import FocusDialogBox from './focusDialogBox';

const GuestModalForm = ({
  handleFormSubmit,
  schema,
}) => {
  return (
    <Formik
      initialValues={{
        email: '',
        firstName: '',
        lastName: '',
      }}
      onSubmit={handleFormSubmit}
      validationSchema={schema}
    >
      {({
        values,
        handleBlur,
        handleSubmit,
        handleChange,
      }) => <FocusDialogBox
        buttonText='Confirm'
        isValid={Boolean(values.firstName && values.lastName && values.email)}
        onSubmit={(event) => handleSubmit(event)}
        text='Let other collaborators know who you are!'
      >
        <div className='form-container'>
          <TextField
            label='First Name'
            name='firstName'
            onBlur={handleBlur}
            onChange={handleChange}
            required
            type='text'
            value={values.firstName}
          />
          <ErrorMessage name='firstName' />
          <TextField
            label='Last Name'
            name='lastName'
            onBlur={handleBlur}
            onChange={handleChange}
            required
            type='text'
            value={values.lastName}
          />
          <ErrorMessage name='lastName' />
          <TextField
            label='Email'
            name='email'
            onBlur={handleBlur}
            onChange={handleChange}
            required
            type='email'
            value={values.email}
          />
          <ErrorMessage name='email' />
        </div>
      </FocusDialogBox>}
    </Formik>
  );
};

export default GuestModalForm;
