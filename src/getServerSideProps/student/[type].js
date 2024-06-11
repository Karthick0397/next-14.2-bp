import { MY_CLASSES_PAGE, MY_COURSE_PAGE } from 'components/Common/SideMenuWithProfile/constants';
import moment from 'moment';
import { ERROR } from 'react-boilerplate-redux-saga-hoc/constants';
import { getServerRequestConfig } from 'shared/HigherOrderComponent/AuthHoc/utils';
import { AuthenticationHocProps } from 'shared/hoc';
import { defaultServerSideProps } from 'utils/getServerSidePropsResponse';

export async function getServerSideProps(context) {
  const { query } = getServerRequestConfig(context);
  const {
    actions: {
      STUDENT_LIST_MY_COURSES_API_CALL,
      LIST_MY_DEMO_SCHEDULES_API_CALL,
      STUDENT_LIST_MY_CLASSES_API_CALL,
    },
    reducerConstants: {
      STUDENT_LIST_MY_COURSES_API,
      LIST_MY_DEMO_SCHEDULES_API,
      STUDENT_LIST_MY_CLASSES_API,
    },
  } = AuthenticationHocProps();
  const props = {};
  let response;

  const constants = [
    STUDENT_LIST_MY_COURSES_API,
    LIST_MY_DEMO_SCHEDULES_API,
    STUDENT_LIST_MY_CLASSES_API,
  ];
  if (query.type === MY_COURSE_PAGE) {
    await STUDENT_LIST_MY_COURSES_API_CALL();
    await LIST_MY_DEMO_SCHEDULES_API_CALL();
  } else if (query.type === MY_CLASSES_PAGE)
    response = await STUDENT_LIST_MY_CLASSES_API_CALL({
      request: {
        query: {
          date: moment(query.date).isValid
            ? moment(query.date).format('YYYY-MM-DD')
            : moment().format('YYYY-MM-DD'),
        },
      },
    });
  if (response?.status === ERROR) {
    return {
      notFound: true,
    };
  }
  return await defaultServerSideProps(context, props, constants);
}

export default getServerSideProps;
