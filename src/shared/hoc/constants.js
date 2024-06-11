export const RESET_INITIAL_STATE_DASHBOARD = "RESET_INITIAL_STATE_DASHBOARD";
export const RESET_INITIAL_STATE_AUTHENTICATION =
  "RESET_INITIAL_STATE_AUTHENTICATION";
export const PROFILE_UPDATE = "PROFILE_UPDATE";
export const MUTATE_AUTHENTICATION_REDUCER = "MUTATE_AUTHENTICATION_REDUCER";
export const MUTATE_DASHBOARD_REDUCER = "MUTATE_DASHBOARD_REDUCER";
export const LOGOUT = "LOGOUT";
export const DASHBOARD_REDUCER_NAME = "Dashboard";
export const AUTHENTICATION_REDUCER_NAME = "Authentication";
export const IS_CLIENT = typeof document !== "undefined";
export const IS_PRODUCTION = process.env.NODE_ENV === "production";
export const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
