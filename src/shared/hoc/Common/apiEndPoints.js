/* eslint-disable no-unused-vars */
import {
  API_END_POINTS_CONFIG_KEYS,
  API_METHODS,
  TAKE_EVERY,
} from "react-boilerplate-redux-saga-hoc/constants";
import { BASE_URL } from "shared/utils/BaseUrl";

const USER_BASE_URL = BASE_URL.concat("/api/v1");
export const UPLOAD_MEDIA = USER_BASE_URL.concat(`/upload`);

const DEFAULT_DATA_KEY = "data";
const DEFAULT_ERROR_KEY = "data";
const TRAILING_SLASH = "";

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
  [API_RESPONSE_SUCCESS_STATUS_CODE_KEY]: "http_status",
  [API_RESPONSE_SUCCESS_STATUS_CODES]: [200, 900, 901],
  [API_RESPONSE_SUCCESS_MESSAGE_KEY]: "message",
  [API_RESPONSE_SUCCESS_DATA_KEY]: DEFAULT_DATA_KEY,
  /** Error Reponse handling */
  [API_RESPONSE_ERROR_STATUS_CODE_KEY]: "",
  [API_ERROR_HANDLER_STATUS_CODES]: [],
  [API_RESPONSE_ERROR_MESSAGE_KEY]: "error",
  [API_RESPONSE_ERROR_DATA_KEY]: DEFAULT_ERROR_KEY,
};

/* Important Please don't delete this line - start */
export const DONT_RESET_ON_LOGOUT_API_KEYS = {};
/* Important Please don't delete this line - end */
