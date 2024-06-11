import { useAuthenticationHOC, useQuery, axios } from 'shared/hoc';
import { useAntdMessage } from 'shared/hooks/Common';
import { useEffect } from 'react';
import { setCookie } from 'shared/hoc/utils';
import { useFormHook } from './form';
import { COOKIE_KEY } from 'shared/HigherOrderComponent/AuthHoc/authConfig';
import { USER_TYPE_MAPPING } from 'utils/Routes/constants';

export const useLoginHook = ({ onSuccess, loginType }) => {
  const { formRef } = useFormHook();
  const {
    reducerName,
    actions: { LOGIN_API_CALL, LOGIN_API_CANCEL, LOGIN_WITH_MOBILE_API_CALL },
    reducerConstants: { LOGIN_API, LOGIN_WITH_MOBILE_API },
  } = useAuthenticationHOC();
  const { errorMessage, successMessage } = useAntdMessage();

  const handleSubmit = () => {
    const { values, isError } = formRef.validateForm();
    if (!isError)
      (loginType === 'mobile' ? LOGIN_WITH_MOBILE_API_CALL : LOGIN_API_CALL)({
        request: {
          payload:
            loginType === 'mobile' ? { mobile: values.mobile } : { ...values, mobile: undefined },
        },
        callback: {
          updateStateCallback:
            loginType === 'mobile'
              ? undefined
              : ({ state, data }) => ({
                  ...state,
                  isLoggedIn: true,
                  profile: data?.data || data,
                }),
          successCallback: ({ state = {}, data = {} }) => {
            const token = data.data && data.data.access_token;

            if (token) {
              // axios.defaults.withCredentials = true;
              setCookie(COOKIE_KEY, token);
              axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            }
            successMessage(
              loginType === 'mobile' ? 'Otp has been sent to your mobile' : 'Logged In'
            );
            onSuccess(USER_TYPE_MAPPING[data.data?.user_type], values);
            //   router.reload();
          },
          errorCallback: ({ errorData = {}, isNetworkError, response }) => {
            const message = errorData.errors || errorData.message;
            if (isNetworkError) errorMessage('Please check your internet connection');
            else if (response.status === 404) errorMessage('user not registered');
            else if (response.status === 400) errorMessage('Invalid creadentials');
            else if (message) errorMessage(message);
            else errorMessage('Sorry unable to login');
          },
        },
      });
  };
  useEffect(() => {
    axios.defaults.withCredentials = false;
    delete axios.defaults.headers.common.Authorization;
    return () => {
      LOGIN_API_CANCEL();
    };
  }, []);

  const [{ loader: submitLoader }, { loader: submitMobileLoader }, isLoggedIn] = useQuery(
    reducerName,
    [
      {
        key: LOGIN_API,
        requiredkey: ['loader'],
      },
      {
        key: LOGIN_WITH_MOBILE_API,
        requiredkey: ['loader'],
      },
      'isLoggedIn',
    ]
  );

  return {
    handleSubmit,
    submitLoader: submitLoader || submitMobileLoader,
    isLoggedIn,
    formRef,
  };
};
