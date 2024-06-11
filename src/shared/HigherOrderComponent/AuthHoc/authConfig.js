import { newObject } from "react-boilerplate-redux-saga-hoc/utils";
import { deleteCookie, getCookieToken } from "shared/hoc/utils";
import { resetHeaders } from "shared/hoc/axios";
import { PROFILE_UPDATE } from "shared/hoc/constants";
import { LANDING_PAGE } from "utils/Routes/routeConstant";

export const AUTH_CHECK_API_URL_KEY = "GET_PROFILE_DETAIL_API_CALL";

/* RESTRICT */
export const DEFAULT_RESTRICT_REDIRECT = LANDING_PAGE.url;

/* AUTH REDIRECT */
export const DEFAULT_AUTH_FAILED_REDIRECT_URL = null;

/* COOKIES */
export const ALLOW_COOKIES_IN_API = false;
export const COOKIE_KEY = "x-access-token";
/* [COOKIE_KEY] This key is mandatory for authentication check without this key authentication wont work */

/* TOKENS */
export const ALLOW_TOKENS_IN_API = true;
export const BEARER_TOKEN = (token) => `Bearer ${token}`;
export const TEST_TOKEN = null;
// export const TEST_TOKEN = BEARER_TOKEN("dummy_token");

/* UPDATE DATA ON AUTH SUCCESS */
export const AUTH_SUCCESS_UPDATE_STATE_CALLBACK = ({ state, data }) =>
  newObject(state, {
    isLoggedIn: true,
  });

/* SUCCESS CALLBACK */
export const AUTH_SUCCESS_CALLBACK =
  (store, axios, res) =>
  ({ data }) => {
    const token = data.data && data.data.access_token;
    if (token) {
      res.setHeader("Set-Cookie", [
        getCookieToken(COOKIE_KEY, token), // Results in cookie being rejected
      ]);
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
    store.dispatch({
      type: PROFILE_UPDATE,
      payload: {
        isLoggedIn: true,
        profile: data?.data || {},
      },
    });
  };

/* ERROR CALLBACK */
export const AUTH_ERROR_CALLBACK = (store, isServer) => (error) => {
  store.dispatch({
    type: PROFILE_UPDATE,
    payload: {
      profile: { ...error.response.data, status: error.response.status },
    },
  });
  if (error.response && error.response.status) {
    if (error.response.status === 401) {
      // Handle 401 error (token expired or unauthorized)
      // Clear the authentication token from headers and cookies
      deleteCookie(COOKIE_KEY);
      deleteCookie("loggedInUser");
      resetHeaders();
    }
  }
};
