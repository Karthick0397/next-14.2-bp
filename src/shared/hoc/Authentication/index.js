import { newObject } from "react-boilerplate-redux-saga-hoc/utils";
import {
  HOC_INITIAL_CONFIG_KEY,
  commonConstants,
} from "react-boilerplate-redux-saga-hoc/constants";

import * as ALL_END_POINTS_CONFIG from "./apiEndPoints";
import { HOC } from "../config";
import axios from "../axios";
import {
  LOGOUT,
  PROFILE_UPDATE,
  RESET_INITIAL_STATE_AUTHENTICATION,
  AUTHENTICATION_REDUCER_NAME,
  MUTATE_AUTHENTICATION_REDUCER,
} from "../constants";

export const { CALL, ON_SUCCESS, ON_ERROR, ON_UNMOUNT, ON_LOADING } =
  commonConstants;

const { DONT_RESET_ON_LOGOUT_API_KEYS } = ALL_END_POINTS_CONFIG;
const API_END_POINTS_CONFIG = newObject(ALL_END_POINTS_CONFIG);
delete API_END_POINTS_CONFIG.DONT_RESET_ON_LOGOUT_API_KEYS;

const initialState = {
  isLoggedIn: false,
  profile: {},
};

const constantReducer = ({
  type,
  state,
  action,
  // constants,
  resetState,
}) => {
  switch (type) {
    case PROFILE_UPDATE:
      return {
        ...state,
        ...action.payload,
      };
    case RESET_INITIAL_STATE_AUTHENTICATION:
      return {
        ...state,
        ...resetState,
        ...initialState,
        ...action.payload,
      };
    case MUTATE_AUTHENTICATION_REDUCER:
      return {
        ...state,
        ...action.payload,
      };
    case LOGOUT:
      return { ...state, ...resetState, ...initialState, ...action.payload };
    default:
      return state;
  }
};

const {
  INITIAL_STATE,
  REDUCER,
  REDUCER_CONSTANT,
  REDUCER_NAME,
  API_END_POINTS,
  DONT_RESET_REDUCER_KEYS,
  AXIOS_INTERCEPTORS,
  GET_DEFAULT_CONFIG,
} = HOC_INITIAL_CONFIG_KEY;

const {
  saga: AuthSaga,
  reducer: AuthReducer,
  hoc: AuthenticationHOC,
  hook: useAuthenticationHOC,
  ...AuthHocProps
} = HOC({
  [INITIAL_STATE]: initialState,
  [REDUCER_CONSTANT]: constantReducer,
  [API_END_POINTS]: API_END_POINTS_CONFIG,
  [DONT_RESET_REDUCER_KEYS]: DONT_RESET_ON_LOGOUT_API_KEYS,
  [REDUCER_NAME]: AUTHENTICATION_REDUCER_NAME,
  [AXIOS_INTERCEPTORS]: axios,
  [GET_DEFAULT_CONFIG]: true,
  [REDUCER]: undefined,
});
// console.log(AuthHocProps);
export {
  AuthenticationHOC,
  useAuthenticationHOC,
  AuthSaga,
  AuthReducer,
  AuthHocProps,
};

/* Important Please don't remove below code for reference 
  const reducer = ({
    constants,
    successData,
    restSuccessData,
    payload,
    query,
    state,
    params,
    restPayload,
    loadingStatus,
    statusCode,
    type,
    newState,
    method,
    reset,
    statusMessage,
    errorData,
    restErrorData,
    resetState,
    initialState,
    commonHandler,
    commmonErrorHandler,
    defaultReducerHandler,
  }) => {
    switch (type) {
      case constants.GET_USER_PROFILE_API[CALL]:
        switch (method) {
          case ON_SUCCESS:
            return newState(({ [type]: Data }) => ({
              profile: successData,
              isLoggedIn: !!(
                successData.member &&
                successData.member.id &&
                successData.member['verification-status']
              ),
              [type]: newObject(Data, commonHandler()),
            }));
          default:
            return defaultReducerHandler(); // for handling others such as Error
        }
      case constants.LOGOUT_API[CALL]:
        switch (method) {
          case ON_SUCCESS:
            return { ...resetState, ...initialState };
          default:
            return defaultReducerHandler(); // for handling others such as Error
        }
      default:
        return defaultReducerHandler();
    }
  };
 */
