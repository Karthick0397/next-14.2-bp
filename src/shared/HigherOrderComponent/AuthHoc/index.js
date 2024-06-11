import React from 'react';
import authCheck from './authCheck';
import { getServerRequestConfig } from './utils';

const AuthHoc = (WrapperComponent) => {
  const Auth = (props) => {
    return <WrapperComponent {...props} />;
  };

  Auth.getInitialProps = async (context) => {
    const { res } = getServerRequestConfig(context);
    const pageProps = await authCheck(context);
    if (WrapperComponent.getInitialProps)
      return await WrapperComponent.getInitialProps(context, pageProps);
    res.end();
  };
  return Auth;
};

export default AuthHoc;
