import moment from 'moment';
import { ERROR } from 'react-boilerplate-redux-saga-hoc/constants';
import { getServerRequestConfig } from 'shared/HigherOrderComponent/AuthHoc/utils';
import { AuthenticationHocProps } from 'shared/hoc';
import { defaultServerSideProps } from 'utils/getServerSidePropsResponse';

export async function getServerSideProps(context) {
  const { query } = getServerRequestConfig(context);
  const {
    actions: { GET_TUTOR_PROFILE_API_CALL },
    reducerConstants: { GET_TUTOR_PROFILE_API },
  } = AuthenticationHocProps();
  const props = {};
  const constants = [GET_TUTOR_PROFILE_API];
  const { status } = await GET_TUTOR_PROFILE_API_CALL({
    request: {
      params: {
        artist_id: query.id,
      },
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
