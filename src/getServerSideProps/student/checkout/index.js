import { ERROR } from 'react-boilerplate-redux-saga-hoc/constants';
import { BEARER_TOKEN } from 'shared/HigherOrderComponent/AuthHoc/authConfig';
import { getServerRequestConfig } from 'shared/HigherOrderComponent/AuthHoc/utils';
import { AuthenticationHocProps } from 'shared/hoc';
import { defaultServerSideProps } from 'utils/getServerSidePropsResponse';

export async function getServerSideProps(context) {
  const { token } = getServerRequestConfig(context);
  const {
    actions: { GET_MY_CART_API_CALL },
    reducerConstants: { GET_MY_CART_API },
    axios,
  } = AuthenticationHocProps();

  const props = {};
  const constants = [GET_MY_CART_API];
  axios.defaults.headers.common.Authorization = BEARER_TOKEN(token);
  const { status } = await GET_MY_CART_API_CALL();
  if (status === ERROR) {
    return {
      notFound: true,
    };
  }
  return await defaultServerSideProps(context, props, constants);
}

export default getServerSideProps;
