import { useForm } from 'utils/FormValidation';

const first_name = {
  isRequired: true,
  message: {
    required: 'Enter your first name',
  },
  inputProps: {
    placeholder: 'Enter your first name',
    label: 'First Name',
  },
};
const last_name = {
  isRequired: true,
  message: {
    required: 'Enter your last name',
  },
  inputProps: {
    placeholder: 'Enter your last name',
    label: 'Last Name',
  },
};
const email = {
  isRequired: true,
  type: 'email',
  message: {
    required: 'This field is required',
    invalid: 'Enter a valid email address',
  },
  inputProps: {
    placeholder: 'Enter your email addess',
    label: 'Email Address',
  },
};
const mobile = {
  isRequired: true,
  allowOnlyNumber: true,
  maxLength: 10,
  minLength: 10,
  message: {
    required: 'This field is required',
    invalid: 'Enter a valid Mobile Number',
    minLength: 'Mobile number should be 10 digits in length',
    maxLength: 'Mobile number should be 10 digits in length',
  },
  inputProps: {
    placeholder: 'Enter your Mobile number',
    label: 'Mobile Number',
  },
};
const password = {
  isRequired: true,
  minLength: 8,
  message: {
    required: 'Password is required',
    minLength: 'Password must contain a minimum of 8 characters',
  },
  inputProps: {
    placeholder: 'Enter password',
    label: 'Password',
  },
};

export const FORM_CONFIG = {
  first_name,
  last_name,
  email,
  password,
  mobile,
};

export const useFormHook = (initialState) =>
  useForm({
    FORM_CONFIG,
    initialState,
  });
