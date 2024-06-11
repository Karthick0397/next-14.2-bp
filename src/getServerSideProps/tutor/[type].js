/* eslint-disable no-undef */
import {
  DASHBOARD_PAGE,
  MY_CLASSES_PAGE,
  MY_COURSE_PAGE,
} from 'components/Common/SideMenuWithProfile/constants';
import moment from 'moment';
import { getServerRequestConfig } from 'shared/HigherOrderComponent/AuthHoc/utils';
import { AuthenticationHocProps } from 'shared/hoc';
import { defaultServerSideProps } from 'utils/getServerSidePropsResponse';

export async function getServerSideProps(context) {
  const { query } = getServerRequestConfig(context);
  const {
    actions: {
      LIST_MY_COURSES_API_CALL,
      TUTOR_LIST_MY_CLASSES_API_CALL,
      TUTOR_DASHBOARD_API_CALL,
      TUTOR_RECENTLY_ONBOARDED_STUDENTS_API_CALL,
    },
    reducerConstants: {
      LIST_MY_COURSES_API,
      TUTOR_LIST_MY_CLASSES_API,
      TUTOR_DASHBOARD_API,
      TUTOR_RECENTLY_ONBOARDED_STUDENTS_API,
    },
  } = AuthenticationHocProps();
  const props = {};
  const constants = [
    LIST_MY_COURSES_API,
    TUTOR_LIST_MY_CLASSES_API,
    TUTOR_DASHBOARD_API,
    TUTOR_RECENTLY_ONBOARDED_STUDENTS_API,
  ];
  await Promise.all(
    [
      MY_COURSE_PAGE && LIST_MY_COURSES_API_CALL(),
      DASHBOARD_PAGE && TUTOR_DASHBOARD_API_CALL(),
      DASHBOARD_PAGE && TUTOR_RECENTLY_ONBOARDED_STUDENTS_API_CALL(),
      [MY_CLASSES_PAGE, DASHBOARD_PAGE].includes(query.type) &&
        TUTOR_LIST_MY_CLASSES_API_CALL({
          request: {
            query: {
              date: moment(query.date).isValid
                ? moment(query.date).format('YYYY-MM-DD')
                : moment.utc().local().format('YYYY-MM-DD'),
            },
          },
        }),
    ].filter((e) => e)
  );
  // if (query.type === MY_COURSE_PAGE) await LIST_MY_COURSES_API_CALL();
  // if (query.type === DASHBOARD_PAGE) {
  //   await TUTOR_DASHBOARD_API_CALL();
  //   await TUTOR_RECENTLY_ONBOARDED_STUDENTS_API();
  // }
  // if ([MY_CLASSES_PAGE, DASHBOARD_PAGE].includes(query.type))
  //   await TUTOR_LIST_MY_CLASSES_API_CALL({
  //     request: {
  //       query: {
  //         date: moment().format('YYYY-MM-DD'),
  //       },
  //     },
  //   });
  // if (response?.status === ERROR) {
  //   return {
  //     notFound: true,
  //   };
  // }
  console.log('====================');
  return await defaultServerSideProps(context, props, constants);
}

export default getServerSideProps;
