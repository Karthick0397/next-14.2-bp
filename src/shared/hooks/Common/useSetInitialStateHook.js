/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import {
  AUTHENTICATION_REDUCER_NAME,
  IS_CLIENT,
  PROFILE_UPDATE,
  MUTATE_AUTHENTICATION_REDUCER,
  MUTATE_DASHBOARD_REDUCER,
  DASHBOARD_REDUCER_NAME,
} from "shared/hoc/constants";
import axios, { resetHeaders, setHeaders } from "shared/hoc/axios";
import { deleteCookie, getCookie } from "shared/hoc/utils";
import { COOKIE_KEY } from "shared/HigherOrderComponent/AuthHoc/authConfig";
import { SERVER_ROUTE_CONFIG } from "utils/Routes/serverRouteConfig";
import { ROUTE_CONFIG_KEY } from "utils/Routes/routeConstant";
import { useAntdMessage } from ".";
const { AUTH_REDIRECT_URL } = ROUTE_CONFIG_KEY;

export default function useSetInitialStateHook({
  pageProps,
  store,
  router,
  profile: _profile,
}) {
  const ref = useRef({ lastUpdated: null });
  const [isModalOpen, setShowLoginModal] = useState(false);
  const message = useAntdMessage();
  const pathname = router.state?.pathname;

  useEffect(() => {
    if (_profile)
      store.dispatch({
        type: PROFILE_UPDATE,
        payload: { profile: _profile },
      });
  }, [pathname, _profile]);

  useEffect(() => {
    axios.interceptors.response.use(
      async (_config) => {
        return _config;
      },
      (error) => {
        if (error.response && error.response.status === 401 && IS_CLIENT) {
          store.dispatch({
            type: MUTATE_AUTHENTICATION_REDUCER,
            payload: {
              isLoggedIn: false,
            },
          });
          resetHeaders();
          deleteCookie(COOKIE_KEY);
          setShowLoginModal(true);
          message.errorMessage("session expired");
        }
        return Promise.reject(error);
      }
    );
  }, []);

  const ACTIVE_ROUTE_CONFIG = SERVER_ROUTE_CONFIG({ pathname });
  const ACTIVE_ROUTE_CONFIG_REDIRECT_URL =
    ACTIVE_ROUTE_CONFIG[AUTH_REDIRECT_URL];

  const IS_LOGGED_IN = store.getState()[AUTHENTICATION_REDUCER_NAME].isLoggedIn;
  const profile = store.getState()[AUTHENTICATION_REDUCER_NAME].profile;
  //   if (
  //     typeof IS_LOGGED_IN === TYPE_BOOLEAN &&
  //     !IS_LOGGED_IN &&
  //     pathname &&
  //     ACTIVE_ROUTE_CONFIG[AUTH_ENABLED] &&
  //     (ACTIVE_ROUTE_CONFIG_REDIRECT_URL || DEFAULT_AUTH_REDIRECT_URL) !==
  //       router.state?.asPath
  //   ) {
  //     if (timeout) clearTimeout(timeout);
  //     timeout = setTimeout(() => {
  //       message.errorMessage("Session expired");
  //     }, 1);
  //     deleteCookie(COOKIE_KEY);
  //     Router.replace(
  //       ACTIVE_ROUTE_CONFIG_REDIRECT_URL || DEFAULT_AUTH_REDIRECT_URL
  //     );
  //   }

  const LAST_SERVER_DATA_UPDATED = pageProps?.__REDUCER_DATA__?.lastUpdated;
  if (
    LAST_SERVER_DATA_UPDATED &&
    ref.current.lastUpdated !== LAST_SERVER_DATA_UPDATED
  ) {
    ref.current.lastUpdated = LAST_SERVER_DATA_UPDATED;
    if (pageProps.__REDUCER_DATA__) {
      if (pageProps.__REDUCER_DATA__[AUTHENTICATION_REDUCER_NAME])
        store.dispatch({
          type: MUTATE_AUTHENTICATION_REDUCER,
          payload: pageProps.__REDUCER_DATA__[AUTHENTICATION_REDUCER_NAME],
        });
      if (pageProps.__REDUCER_DATA__[DASHBOARD_REDUCER_NAME])
        store.dispatch({
          type: MUTATE_DASHBOARD_REDUCER,
          payload: pageProps.__REDUCER_DATA__[DASHBOARD_REDUCER_NAME],
        });
    }
  }

  if (IS_CLIENT) delete pageProps.__REDUCER_DATA__;
  const _pageProps = { ...pageProps };

  let _store;
  if (IS_CLIENT) {
    const token = getCookie(COOKIE_KEY);
    _store = store;
    global.__REDUX_STORE__ = _store;
    if (IS_LOGGED_IN) setHeaders(token);
    if (profile.status === 401) {
      if (token) {
        if (router.state?.pathname !== "/_error") {
          message.errorMessage("session expired");
        }
        resetHeaders();
        deleteCookie(COOKIE_KEY);
      }
    }
  } else {
    _store = global.__REDUX_STORE__ || store;
    delete global.__REDUX_STORE__;
  }
  return { _store, _pageProps, isModalOpen, setShowLoginModal };
}
