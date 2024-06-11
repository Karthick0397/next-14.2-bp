import { ERROR } from 'react-boilerplate-redux-saga-hoc/constants';
import { getServerRequestConfig } from 'shared/HigherOrderComponent/AuthHoc/utils';
import { AuthenticationHocProps } from 'shared/hoc';
import { defaultServerSideProps } from 'utils/getServerSidePropsResponse';

export async function getServerSideProps(context) {
  const { query } = getServerRequestConfig(context);

  const {
    actions: { LIST_COURSES_API_CALL },
    reducerConstants: { LIST_COURSES_API },
  } = AuthenticationHocProps();
  const props = {};
  const constants = [LIST_COURSES_API];
  const { status } = await LIST_COURSES_API_CALL({
    request: {
      query,
    },
  });
  if (status === ERROR) {
    return {
      notFound: true,
    };
  }

  return await defaultServerSideProps(context, props, constants);
}

export default getServerSideProps;
