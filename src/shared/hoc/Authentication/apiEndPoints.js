/* eslint-disable no-unused-vars */
import {
  API_END_POINTS_CONFIG_KEYS,
  API_METHODS,
  TAKE_EVERY,
} from 'react-boilerplate-redux-saga-hoc/constants';
import { BASE_URL } from 'shared/utils/BaseUrl';

const USER_BASE_URL = BASE_URL.concat('/api/v1');
export const UPLOAD_MEDIA = USER_BASE_URL.concat(`/upload`);

const DEFAULT_DATA_KEY = 'data';
const DEFAULT_ERROR_KEY = 'data';
const TRAILING_SLASH = '';

const {
  API_URL /* Function<return string> | String - Enter api url eg: ({ params<optional>,query<optional> }) => `${API_BASE_URL}/users/${id}?${query}` | `${API_BASE_URL}/users/1` */,
  API_METHOD /* String - Enter api method for handling api calls eg: API_METHODS.GET */,
  API_RESPONSE_SUCCESS_STATUS_CODE_KEY /* String - Enter key mapping for refering the status code eg: 'code' */,
  API_RESPONSE_SUCCESS_STATUS_CODES /* Array<Number> - success status code can be passed here inorder to handle success response eg: [ 920, 931 ] other than this code will throw error if you dont pass the code default will be [200]  */,
  API_RESPONSE_SUCCESS_MESSAGE_KEY /* String - Enter key mapping for refering the success message eg: 'message' */,
  API_RESPONSE_SUCCESS_DATA_KEY /* String - Enter key mapping for refering the success data eg: 'data'  */,
  API_RESPONSE_ERROR_DATA_KEY /* String - Enter key mapping for refering the error data eg: 'error_data' */,
  API_RESPONSE_ERROR_STATUS_CODE_KEY /* String - Enter key mapping for refering the error status code eg: 'error_code' */,
  API_RESPONSE_ERROR_MESSAGE_KEY /* String - Enter key mapping for refering the error message eg: 'error' */,
  API_ERROR_HANDLER_STATUS_CODES /* Array<Number> - error status code can be passed here inorder to throw error on success response eg: [ 900, 901 ]  */,
  DEBOUNCE_API_CALL_DELAY_IN_MS /* This is required if you are using IS_DEBOUNCE_API_CALL */,
  IS_DEBOUNCE_API_CALL /* it can be used for search api  */,
  AXIOS_INTERCEPTORS /* New Axios instance can be passed here to seperate the token */,
  SAGA_EFFECT /* every | latest */,
} = API_END_POINTS_CONFIG_KEYS;

const COMMON_REQUEST_RESPONSE_KEYS = {
  [API_METHOD]: API_METHODS.GET,
  /** Success Reponse handling */
  [API_RESPONSE_SUCCESS_STATUS_CODE_KEY]: 'http_status',
  [API_RESPONSE_SUCCESS_STATUS_CODES]: [200, 900, 901],
  [API_RESPONSE_SUCCESS_MESSAGE_KEY]: 'message',
  [API_RESPONSE_SUCCESS_DATA_KEY]: DEFAULT_DATA_KEY,
  /** Error Reponse handling */
  [API_RESPONSE_ERROR_STATUS_CODE_KEY]: '',
  [API_ERROR_HANDLER_STATUS_CODES]: [],
  [API_RESPONSE_ERROR_MESSAGE_KEY]: 'error',
  [API_RESPONSE_ERROR_DATA_KEY]: DEFAULT_ERROR_KEY,
};

/* ******  Authentication APIs Start ****** */

/** Teacher APIs */
export const SIGNUP_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: USER_BASE_URL.concat(`/signup/email`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.POST,
};
export const SIGNUP_WITH_MOBILE_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: USER_BASE_URL.concat(`/signup/mobile`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.POST,
};
export const LOGIN_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: USER_BASE_URL.concat(`/login/email`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.POST,
};
export const LOGIN_WITH_MOBILE_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: USER_BASE_URL.concat(`/login/mobile`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.POST,
};
export const VERIFY_OTP_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: USER_BASE_URL.concat(`/verify-otp`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.POST,
};
export const GET_PROFILE_DETAIL_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  // [API_RESPONSE_SUCCESS_STATUS_CODE_KEY]: "status",
  [API_URL]: USER_BASE_URL.concat(`/profile`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.GET,
};
export const GET_CORE_CATEGORY_LIST_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: USER_BASE_URL.concat(`/cores`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.GET,
};
export const GET_CORE_SKILL_LIST_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: USER_BASE_URL.concat(`/skills`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.GET,
};
export const CREATE_COURSES_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: USER_BASE_URL.concat(`/courses`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.POST,
};
export const UPDATE_COURSES_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: ({ id }) =>
    USER_BASE_URL.concat(`/my-courses`).concat(`/${id}`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.PUT,
};
export const LIST_MY_COURSE_SCHEDULES_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: USER_BASE_URL.concat(`/my-courses/schedules`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.GET,
};
export const DEMO_COURSE_SCHEDULE_BOOKING_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: ({ artist_id }) =>
    USER_BASE_URL.concat(`/artist/${artist_id}/bookings`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.POST,
};
export const GET_COURSE_BOOKING_STATUS_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: ({ artist_id }) =>
    USER_BASE_URL.concat(`/artist/${artist_id}/bookings`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.GET,
};
export const GET_COURSE_BY_ID_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: ({ id }) => USER_BASE_URL.concat(`/courses/${id}`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.GET,
};
export const GET_COURSE_DEMO_SCHEDULE_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: () => USER_BASE_URL.concat(`/artist/demo-schedules`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.GET,
};
export const PUBLISH_COURSE_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: ({ course_id }) =>
    USER_BASE_URL.concat(`/courses/${course_id}/publish`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.POST,
};

export const UPDATE_PROFILE_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: USER_BASE_URL.concat(`/profile`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.PATCH,
};
export const ADD_ARTIST_EXPERIENCES_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: USER_BASE_URL.concat(`/artists/experiences`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.POST,
};
export const ADD_ARTIST_EDUCATION_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: USER_BASE_URL.concat(`/artists/educations`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.POST,
};
export const ADD_ARTIST_ACHIEVEMENTS_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: USER_BASE_URL.concat(`/artists/achievements`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.POST,
};
export const ADD_ARTIST_ENDORSEMENTS_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: USER_BASE_URL.concat(`/artists/endorsements`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.POST,
};
export const UPDATE_ARTIST_EXPERIENCES_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: ({ id }) => USER_BASE_URL.concat(`/artists/experiences/${id}`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.PATCH,
};
export const UPDATE_ARTIST_EDUCATION_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: ({ id }) => USER_BASE_URL.concat(`/artists/educations/${id}`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.PATCH,
};
export const UPDATE_ARTIST_ACHIEVEMENTS_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: ({ id }) => USER_BASE_URL.concat(`/artists/achievements/${id}`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.PATCH,
};
export const UPDATE_ARTIST_ENDORSEMENTS_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: ({ id }) => USER_BASE_URL.concat(`/artists/endorsements/${id}`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.PATCH,
};
export const LIST_MY_COURSES_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: USER_BASE_URL.concat(`/my-courses`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.GET,
};
export const DELETE_MY_COURSES_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: ({ course_id }) =>
    USER_BASE_URL.concat(`/my-courses/${course_id}`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.DELETE,
};
export const DELETE_COURSE_SCHEDULE_TIMING_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: ({ timing_id }) =>
    USER_BASE_URL.concat(`/courses/schedule/day/timing/${timing_id}`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.DELETE,
};
export const GET_MY_CART_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: USER_BASE_URL.concat(`/cart`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.GET,
};
export const ADD_TO_CART_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: USER_BASE_URL.concat(`/cart`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.POST,
};
export const DELETE_CART_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: ({ id }) => USER_BASE_URL.concat(`/cart/${id}`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.DELETE,
};

export const UPLOAD_FILE_TO_S3_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: ({ url }) => `${url}`,
  [API_METHOD]: API_METHODS.PUT,
  [API_RESPONSE_SUCCESS_DATA_KEY]: 'data',
  [SAGA_EFFECT]: TAKE_EVERY,
};
export const GENERATE_S3_UPLOAD_URL = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: USER_BASE_URL.concat(`/upload`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.POST,
  [API_RESPONSE_SUCCESS_DATA_KEY]: 'data',
  [SAGA_EFFECT]: TAKE_EVERY,
};
export const LIST_COURSES_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: USER_BASE_URL.concat('/courses').concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.GET,
  [API_RESPONSE_SUCCESS_DATA_KEY]: null,
};
export const LIST_MY_DEMO_SCHEDULES_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: USER_BASE_URL.concat('/student/my-demo-schedules').concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.GET,
};
export const GET_DEMO_SCHEDULES_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: ({ artist_id }) =>
    USER_BASE_URL.concat(`/teacher/${artist_id}/demo-schedules`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.GET,
};
export const GET_USER_COURSE_SCHEDULE_BOOKED_STATUS = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: ({ course_id }) =>
    USER_BASE_URL.concat(`/courses/${course_id}/user-schedules`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.GET,
};
export const UPDATE_FEEDBACK_FOR_DEMO_SCHEDULE_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: ({ demo_schedule_id }) =>
    USER_BASE_URL.concat(`/student/my-demo-schedules/${demo_schedule_id}/feedback`).concat(
      TRAILING_SLASH
    ),
  [API_METHOD]: API_METHODS.POST,
};
export const UPDATE_TEACHER_FEEDBACK_FOR_DEMO_SCHEDULE_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: ({ demo_schedule_id }) =>
    USER_BASE_URL.concat(`/teacher/my-demo-schedules/${demo_schedule_id}/feedback`).concat(
      TRAILING_SLASH
    ),
  [API_METHOD]: API_METHODS.POST,
};
export const GET_ORDERS_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: USER_BASE_URL.concat('/orders').concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.POST,
};

/** =========== STUDENT API =========== */
export const STUDENT_LIST_MY_COURSES_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: USER_BASE_URL.concat(`/student/my-courses`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.GET,
};
export const STUDENT_CLASS_DETAIL_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: ({ course_id, schedule_id }) =>
    USER_BASE_URL.concat(`/student/my-courses/${course_id}/schedules/${schedule_id}`).concat(
      TRAILING_SLASH
    ),
  [API_METHOD]: API_METHODS.GET,
};
export const STUDENT_LIST_MY_CLASSES_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: () => USER_BASE_URL.concat(`/student/my-classes`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.GET,
};
export const TUTOR_CLASS_DETAIL_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: ({ course_id, schedule_id }) =>
    USER_BASE_URL.concat(`/my-courses/${course_id}/schedules/${schedule_id}`).concat(
      TRAILING_SLASH
    ),
  [API_METHOD]: API_METHODS.GET,
};
export const TUTOR_LIST_MY_CLASSES_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: () => USER_BASE_URL.concat(`/teacher/my-classes`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.GET,
};
export const TUTOR_RECENTLY_ONBOARDED_STUDENTS_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: () =>
    USER_BASE_URL.concat(`/teacher/dashboard/recent-students`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.GET,
};
export const TUTOR_MARK_ATTENDENCE_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: ({ course_id, schedule_id }) =>
    USER_BASE_URL.concat(
      `/my-courses/${course_id}/schedules/${schedule_id}/mark-attendance`
    ).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.POST,
};
export const STUDENT_RAISE_DISPUTE_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: ({ schedule_id }) =>
    USER_BASE_URL.concat(`/courses/user-schedules/${schedule_id}/dispute`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.POST,
};
export const TUTOR_DASHBOARD_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: () => USER_BASE_URL.concat(`/teacher/dashboard`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.GET,
};
export const LIST_MY_COURSE_SCHEDULES_BY_SCHEDULE_ID = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: ({ course_schedule_id }) =>
    USER_BASE_URL.concat(`/student/my-courses/schedules/${course_schedule_id}/renewal`).concat(
      TRAILING_SLASH
    ),
  [API_METHOD]: API_METHODS.GET,
};
export const POST_RENEW_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: ({ course_schedule_id }) =>
    USER_BASE_URL.concat(`/student/my-courses/schedules/${course_schedule_id}/renewal`).concat(
      TRAILING_SLASH
    ),
  [API_METHOD]: API_METHODS.POST,
};
export const GET_TUTOR_PROFILE_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: ({ artist_id }) =>
    USER_BASE_URL.concat(`/artists/${artist_id}`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.GET,
};
export const REMOVE_COURSE_SCHEDULE_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: ({ course_schedule_id, user_id }) =>
    USER_BASE_URL.concat(`/my-courses/schedules/${course_schedule_id}/students/${user_id}`).concat(
      TRAILING_SLASH
    ),
  [API_METHOD]: API_METHODS.DELETE,
};
/** =========== STUDENT API =========== */

/* Important Please don't delete this line - start */
export const DONT_RESET_ON_LOGOUT_API_KEYS = {
  LIST_MY_COURSE_SCHEDULES_API,
  GET_COURSE_BY_ID_API,
  LIST_MY_COURSES_API,
  GET_TUTOR_PROFILE_API,
};
/* Important Please don't delete this line - end */
