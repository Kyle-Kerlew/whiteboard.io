import * as Yup from 'yup';

const SignInAsGuestSchema = Yup.object()
  .shape({
    email: Yup.string()
      .email('The email provided is invalid.')
      .required('Email is required.'),
    firstName: Yup.string()
      .min(2, 'First Name must be more than 1 character.')
      .max(50, 'First Name must be less than 50 characters.')
      .required('First name is required.'),
    lastName: Yup.string()
      .min(2, 'Last name must be more than 1 character.')
      .max(50, 'Last name must be less than 50 characters.')
      .required('Last name is required.'),
  });

export default SignInAsGuestSchema;
