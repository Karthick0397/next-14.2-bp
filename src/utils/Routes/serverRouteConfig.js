import { ROUTE_CONFIG_KEY, LANDING_PAGE } from "./routeConstant";

const {
  RESTRICT_URL,
  AUTH_ENABLED,
  SHOW_LOGIN_MODAL,
  RESTRICT_REDIRECT_URL,
  DONT_REDIRECT_ON_LOGOUT,
  AUTH_SUCCESS_REDIRECT_URL,
  AUTH_FAILED_REDIRECT_URL,
} = ROUTE_CONFIG_KEY;

const IS_AUTH_ENABLED = true;
const IS_RESTRICT_ROUTE = true;

export const SERVER_ROUTE_CONFIG = ({ pathname, user_type }) => {
  const DEFAULT_AUTH_FAILED_REDIRECT_URL = LANDING_PAGE.url;
  const ROUTE_CONFIG = {
    // /** HOME PAGE **/
    // [HOME_PAGE.pathname]: {
    //   [AUTH_ENABLED]: IS_AUTH_ENABLED,
    //   [AUTH_FAILED_REDIRECT_URL]: DEFAULT_AUTH_FAILED_REDIRECT_URL,
    //   [AUTH_SUCCESS_REDIRECT_URL]: DASHBOARD[USER_TYPE].url,
    // },

    // /** LANDING PAGE **/
    // [LANDING_PAGE.pathname]: {
    //   [AUTH_ENABLED]: IS_AUTH_ENABLED,
    //   [AUTH_SUCCESS_REDIRECT_URL]: DASHBOARD[USER_TYPE].url,
    // },
    /** LANDING PAGE **/
    [LANDING_PAGE.pathname]: {
      [AUTH_ENABLED]: IS_AUTH_ENABLED,
      [AUTH_FAILED_REDIRECT_URL]: DEFAULT_AUTH_FAILED_REDIRECT_URL,
      // [AUTH_SUCCESS_REDIRECT_URL]: DASHBOARD[USER_TYPE].url,
    },
  };

  return ROUTE_CONFIG[pathname] || {};
};