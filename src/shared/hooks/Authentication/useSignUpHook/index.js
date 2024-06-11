import { useAuthenticationHOC, useMutateReducer, useQuery, axios } from 'shared/hoc';
import { useAntdMessage } from 'shared/hooks/Common';

import { typeOf } from 'react-boilerplate-redux-saga-hoc/utils';
import { useEffect } from 'react';
import { setCookieWithExpiration } from 'shared/utils/utilFunctions';
import { setCookie } from 'shared/hoc/utils';
import { useFormHook } from './form';
import { COOKIE_KEY } from 'shared/HigherOrderComponent/AuthHoc/authConfig';
import { STUDENT, TEACHER } from 'utils/Routes/constants';

export const useSignUpHook = ({ onSuccess, USER_TYPE, signUpType }) => {
  const { formRef } = useFormHook();

  const {
    reducerName,
    actions: { SIGNUP_API_CALL, SIGNUP_API_CANCEL, SIGNUP_WITH_MOBILE_API_CALL },
    reducerConstants: { SIGNUP_API, SIGNUP_WITH_MOBILE_API },
  } = useAuthenticationHOC(false);
  const { errorMessage, successMessage } = useAntdMessage();

  const handleSubmit = () => {
    const { values, isError, errors } = formRef.validateForm();
    console.log(errors);
    if (!isError)
      (signUpType === 'Mobile' ? SIGNUP_WITH_MOBILE_API_CALL : SIGNUP_API_CALL)({
        request: {
          payload: {
            ...values,
            ...(signUpType === 'Mobile'
              ? {
                  email: undefined,
                  password: undefined,
                  mobile: values.mobile,
                  country_code: '+91',
                }
              : {
                  email: values.email,
                  password: values.password,
                  mobile: undefined,
                  country_code: undefined,
                }),
            user_type: USER_TYPE === STUDENT ? STUDENT : TEACHER,
          },
        },
        callback: {
          updateStateCallback:
            signUpType === 'Email'
              ? ({ state, data }) => ({
                  ...state,
                  isLoggedIn: true,
                  profile: data.data || data,
                })
              : undefined,
          successCallback: ({ state = {}, data = {} }) => {
            const token = data.data && data.data.access_token;

            if (token) {
              // axios.defaults.withCredentials = true;
              setCookie(COOKIE_KEY, token, 2);
              axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            }
            successMessage('SIGNUP successfull');

            setTimeout(() => {
              onSuccess(values);
            }, 1);
            //   router.reload();
          },
          errorCallback: ({ errorData = {}, isNetworkError, response }) => {
            const message = errorData.errors || errorData.message;
            if (isNetworkError) errorMessage('Please check your internet connection');
            else if (response.status === 404) errorMessage(message);
            else if (response.status === 400) errorMessage(message);
            else if (typeof message === 'string') errorMessage(message);
            else errorMessage('Sorry unable to signup.Please try again later');
          },
        },
      });
  };
  useEffect(() => {
    axios.defaults.withCredentials = false;
    delete axios.defaults.headers.common.Authorization;
    return () => {
      SIGNUP_API_CANCEL();
    };
  }, []);

  const [{ loader: submitLoader }, { loader: submitMobileLoader }] = useQuery(reducerName, [
    {
      key: SIGNUP_API,
      requiredkey: ['loader'],
    },
    {
      key: SIGNUP_WITH_MOBILE_API,
      requiredkey: ['loader'],
    },
  ]);
  const isLoggedIn = useQuery(reducerName, {
    query: '.isLoggedIn',
  });
  return {
    handleSubmit,
    submitLoader: submitLoader || submitMobileLoader,
    isLoggedIn,
    formRef,
  };
};
