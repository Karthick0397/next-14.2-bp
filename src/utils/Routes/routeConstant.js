import { HOME_PAGE_URL, LANDING_PAGE_URL } from "./constants";

export const ROUTE_CONFIG_KEY = {
  AUTH_ENABLED: "AUTH_ENABLED",
  RESTRICT_URL: "RESTRICT_URL",
  REDIRECT_URL: "REDIRECT_URL",
  RESTRICT_REDIRECT_URL: "RESTRICT_REDIRECT_URL",
  AUTH_FAILED_REDIRECT_URL: "AUTH_FAILED_REDIRECT_URL",
  AUTH_SUCCESS_REDIRECT_URL: "AUTH_SUCCESS_REDIRECT_URL",
  DONT_REDIRECT_ON_LOGOUT: "DONT_REDIRECT_ON_LOGOUT",
  SHOW_LOGIN_MODAL: "SHOW_LOGIN_MODAL",
};

export const HOME_PAGE = {
  pathname: HOME_PAGE_URL,
  url: HOME_PAGE_URL,
};

export const LANDING_PAGE = {
  pathname: LANDING_PAGE_URL,
  url: LANDING_PAGE_URL,
};
