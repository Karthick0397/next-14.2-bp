import { getServerRequestConfig } from './utils';
import { AuthenticationHocProps } from 'shared/hoc';
import { SERVER_ROUTE_CONFIG } from 'utils/Routes/serverRouteConfig';
import { ROUTE_CONFIG_KEY } from 'utils/Routes/routeConstant';
import {
  ALLOW_COOKIES_IN_API,
  ALLOW_TOKENS_IN_API,
  AUTH_CHECK_API_URL_KEY,
  BEARER_TOKEN,
  DEFAULT_AUTH_FAILED_REDIRECT_URL,
  DEFAULT_RESTRICT_REDIRECT,
  AUTH_SUCCESS_UPDATE_STATE_CALLBACK,
  AUTH_SUCCESS_CALLBACK,
  AUTH_ERROR_CALLBACK,
} from './authConfig';
import { API_TASK_CONFIG_KEYS, ERROR, SUCCESS } from 'react-boilerplate-redux-saga-hoc/constants';
import { IS_CLIENT } from 'shared/hoc/constants';

const { CALLBACK: _CALLBACK } = API_TASK_CONFIG_KEYS;
const { UPDATE_STATE_CALLBACK, SUCCESS_CALLBACK, ERROR_CALLBACK, KEY: CALLBACK } = _CALLBACK;

const {
  RESTRICT_URL,
  RESTRICT_REDIRECT_URL,
  AUTH_ENABLED,
  AUTH_FAILED_REDIRECT_URL,
  AUTH_SUCCESS_REDIRECT_URL,
} = ROUTE_CONFIG_KEY;

const ALLOW_RESTRICT = true;
const ALLOW_REDIRECT = true;
const ALLOW_AUTH = true;
const REDIRECT_STATUS_CODE = 307;

const authCheck = async (context) => {
  const props = getServerRequestConfig(context);
  const { res, req, store, pathname, query, asPath, isServer, token } = props;
  const IS_TOKEN_AVAILABLE = !!token;
  const PATH_NAME = props.pathname;
  const IS_LOGGEDIN = store.getState().Authentication.isLoggedIn;
  const CURRENT_ROUTE_CONFIG = SERVER_ROUTE_CONFIG(props);
  const IS_SERVER = isServer;
  const REDIRECT = (_URL) => {
    if (ALLOW_REDIRECT && _URL) {
      res.writeHead(REDIRECT_STATUS_CODE, {
        Location: _URL,
      });
      res.end();
    }
  };
  if (ALLOW_RESTRICT && CURRENT_ROUTE_CONFIG[RESTRICT_URL] && IS_SERVER && !IS_CLIENT)
    REDIRECT(CURRENT_ROUTE_CONFIG[RESTRICT_REDIRECT_URL] || DEFAULT_RESTRICT_REDIRECT);

  const {
    actions: { [AUTH_CHECK_API_URL_KEY]: authCheckApi },
    axios,
  } = AuthenticationHocProps();

  const LOGIN_REDIRECT = () => {
    if (CURRENT_ROUTE_CONFIG[AUTH_SUCCESS_REDIRECT_URL])
      REDIRECT(CURRENT_ROUTE_CONFIG[AUTH_SUCCESS_REDIRECT_URL]);
  };
  const auth_redirect = () => {
    if (CURRENT_ROUTE_CONFIG[AUTH_ENABLED]) {
      const REDIRECT_URL =
        CURRENT_ROUTE_CONFIG[AUTH_FAILED_REDIRECT_URL] || DEFAULT_AUTH_FAILED_REDIRECT_URL;
      const IS_ROUTE_ACTIVE = REDIRECT_URL === PATH_NAME;
      if (!IS_ROUTE_ACTIVE && REDIRECT_URL) REDIRECT(REDIRECT_URL);
    }
  };

  if (IS_LOGGEDIN) {
    LOGIN_REDIRECT();
  } else if (!IS_TOKEN_AVAILABLE) {
    delete axios.defaults.headers.common.Authorization;
    axios.defaults.withCredentials = false;
    auth_redirect();
  } else if (!IS_LOGGEDIN) {
    if (ALLOW_AUTH && CURRENT_ROUTE_CONFIG[AUTH_ENABLED]) {
      if (ALLOW_COOKIES_IN_API || ALLOW_TOKENS_IN_API) {
        try {
          if (ALLOW_COOKIES_IN_API) axios.defaults.withCredentials = true;
          if (ALLOW_TOKENS_IN_API && IS_TOKEN_AVAILABLE)
            axios.defaults.headers.common.Authorization = BEARER_TOKEN(token);
          const { status, data } = await authCheckApi({
            [CALLBACK]: {
              [UPDATE_STATE_CALLBACK]: AUTH_SUCCESS_UPDATE_STATE_CALLBACK,
              [ERROR_CALLBACK]: AUTH_ERROR_CALLBACK(store, axios, isServer),
              [SUCCESS_CALLBACK]: AUTH_SUCCESS_CALLBACK(store, axios, res),
            },
          });
          if (status === SUCCESS) {
            LOGIN_REDIRECT();
            return { profile: data, isLoggedIn: true };
          } else {
            auth_redirect();
          }
        } catch (err) {
          auth_redirect();
        }
      } else auth_redirect();
    }
  }
};

export default authCheck;
