/* eslint-disable no-unused-vars */
import {
  API_END_POINTS_CONFIG_KEYS,
  API_METHODS,
} from 'react-boilerplate-redux-saga-hoc/constants';
import { ADMIN_BASE_URL, BASE_URL } from 'shared/utils/BaseUrl';

// const API_BASE_URL = `${BASE_URL}/api/v1/`;
const USER_BASE_URL = BASE_URL.concat('/api/v1');
const TRAILING_SLASH = '/';

export const UPLOAD_MEDIA = USER_BASE_URL.concat(`/upload`);
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
  [API_RESPONSE_SUCCESS_STATUS_CODE_KEY]: 'code_key',
  [API_RESPONSE_SUCCESS_STATUS_CODES]: [200, 900, 901],
  [API_RESPONSE_SUCCESS_MESSAGE_KEY]: 'message',
  [API_RESPONSE_SUCCESS_DATA_KEY]: 'data',
  /** Error Reponse handling */
  [API_RESPONSE_ERROR_STATUS_CODE_KEY]: '',
  [API_ERROR_HANDLER_STATUS_CODES]: [],
  [API_RESPONSE_ERROR_MESSAGE_KEY]: 'error',
  [API_RESPONSE_ERROR_DATA_KEY]: 'data',
};

/* ******  Common APIs Start ****** */

/** Forum APIs */
export const GET_FORUM_POST_LIST_API = {
  // ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: USER_BASE_URL.concat(`/forums`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.GET,
};
export const GET_FORUM_CATEGORIES_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: USER_BASE_URL.concat(`/forum-categories`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.GET,
  [SAGA_EFFECT]: 'every',
};
export const TAGS_LIST_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: USER_BASE_URL.concat(`/forum-tags`).concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.GET,
};
export const CREATE_FORUM_POST_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: USER_BASE_URL.concat('/forums').concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.POST,
};
export const LIKE_FORUM_POST_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: USER_BASE_URL.concat('/forums/like').concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.POST,
};
/** Forum - Replies Start APIs */
export const GET_FORUM_REPLIES_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: USER_BASE_URL.concat('/forum-replies/replies').concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.GET,
};
export const POST_FORUM_REPLY_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: USER_BASE_URL.concat('/forum-replies').concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.POST,
};
export const UPDATE_FORUM_REPLY_LIKE_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: USER_BASE_URL.concat('/forum-replies/like').concat(TRAILING_SLASH),
  [API_METHOD]: API_METHODS.POST,
};

/** Forum - Replies End APIs */

/** Shopping Start APIs */
export const GET_ALL_PRODUCTS_API = {
  [API_URL]: USER_BASE_URL.concat(`/products`),
  [API_METHOD]: API_METHODS.GET,
};
export const GET_PRODUCT_DETAIL_API = {
  [API_URL]: ({ id }) => USER_BASE_URL.concat(`/products/${id}`),
  [API_METHOD]: API_METHODS.GET,
};
export const GET_BRANDS_API = {
  [API_URL]: USER_BASE_URL.concat(`/product-brands`),
  [API_METHOD]: API_METHODS.GET,
  [SAGA_EFFECT]: 'every',
};
export const GET_PRODUCT_CATEGORIES_API = {
  [API_URL]: USER_BASE_URL.concat(`/product-categories`),
  [API_METHOD]: API_METHODS.GET,
};

export const GET_PRODUCT_REVIEWS_API = {
  [API_URL]: ({ id }) => USER_BASE_URL.concat(`/products/${id}/reviews`),
  [API_METHOD]: API_METHODS.GET,
};
export const ADD_PRODUCTS_TO_CART_API = {
  [API_URL]: ({ id }) => USER_BASE_URL.concat(`/products/${id}/reviews`),
  [API_METHOD]: API_METHODS.POST,
};
export const POST_PRODUCT_REVIEWS_API = {
  [API_URL]: ({ id }) => USER_BASE_URL.concat(`/products/${id}/reviews`),
  [API_METHOD]: API_METHODS.POST,
};

export const PRODUCT_WHISHLIST_API = {
  [API_URL]: ({ id }) => USER_BASE_URL.concat(`/products/${id}/product-whitelist`),
  [API_METHOD]: API_METHODS.POST,
};
export const PRODUCT_ADD_TO_CART_API = {
  [API_URL]: USER_BASE_URL.concat(`/product-cart`),
  [API_METHOD]: API_METHODS.POST,
};
export const PRODUCT_REMOVE_FROM_CART_API = {
  [API_URL]: ({ id }) => USER_BASE_URL.concat(`/cart/${id}`),
  [API_METHOD]: API_METHODS.DELETE,
};
export const GET_ALL_PRODUCT_GROUPS_API = {
  [API_URL]: USER_BASE_URL.concat(`/product-groups`),
  [API_METHOD]: API_METHODS.GET,
};
export const PRODUCT_BY_GROUP_SLUG_API = {
  [API_URL]: ({ id }) => USER_BASE_URL.concat(`/product-groups/${id}`),
  [API_METHOD]: API_METHODS.GET,
  [SAGA_EFFECT]: 'every',
};
/** Shopping End APIs */

/** Blogs Start APIs */
export const GET_ALL_BLOGS = {
  [API_URL]: ADMIN_BASE_URL.concat(`/api/blogs`),
  [API_METHOD]: API_METHODS.GET,
};
/** Blogs End APIs */

/* ******  Common APIs End ****** */

/* Important Please don't delete this line - start */
export const DONT_RESET_ON_LOGOUT_API_KEYS = {
  GET_ALL_PRODUCTS_API,
  GET_FORUM_POST_LIST_API,
  GET_FORUM_CATEGORIES_API,
  TAGS_LIST_API,
};
/* Important Please don't delete this line - end */
