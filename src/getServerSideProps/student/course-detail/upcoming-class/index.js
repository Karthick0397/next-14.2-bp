import moment from 'moment';
import { ERROR } from 'react-boilerplate-redux-saga-hoc/constants';
import { getServerRequestConfig } from 'shared/HigherOrderComponent/AuthHoc/utils';
import { AuthenticationHocProps } from 'shared/hoc';
import { defaultServerSideProps } from 'utils/getServerSidePropsResponse';

export async function getServerSideProps(context) {
  console.log('==============');

  const { query } = getServerRequestConfig(context);
  const {
    actions: { STUDENT_CLASS_DETAIL_API_CALL },
    reducerConstants: { STUDENT_CLASS_DETAIL_API },
  } = AuthenticationHocProps();
  const props = {};
  const constants = [STUDENT_CLASS_DETAIL_API];
  const { status } = await STUDENT_CLASS_DETAIL_API_CALL({
    request: {
      params: {
        course_id: query.id,
        schedule_id: query.schedule_id,
      },
      query: {
        date: moment(query.date).isValid
          ? moment(query.date).format('YYYY-MM-DD')
          : moment().format('YYYY-MM-DD'),
      },
    },
  });
  if (status === ERROR) {
    return {
      notFound: true,
    };
  }
  console.log(status);
  return await defaultServerSideProps(context, props, constants);
}

export default getServerSideProps;
