import { newObject } from "react-boilerplate-redux-saga-hoc/utils";
import {
  HOC_INITIAL_CONFIG_KEY,
  commonConstants,
} from "react-boilerplate-redux-saga-hoc/constants";

import * as ALL_END_POINTS_CONFIG from "./apiEndPoints";
import axios from "../axios";
import { HOC } from "../config";
import {
  LOGOUT,
  RESET_INITIAL_STATE_DASHBOARD,
  DASHBOARD_REDUCER_NAME,
  MUTATE_DASHBOARD_REDUCER,
} from "../constants";

export const { CALL, ON_SUCCESS, ON_ERROR, ON_UNMOUNT, ON_LOADING } =
  commonConstants;

const { DONT_RESET_ON_LOGOUT_API_KEYS } = ALL_END_POINTS_CONFIG;
const API_END_POINTS_CONFIG = newObject(ALL_END_POINTS_CONFIG);
delete API_END_POINTS_CONFIG.DONT_RESET_ON_LOGOUT_API_KEYS;

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

const initialState = {};

const reducer = ({ type, defaultReducerHandler }) => {
  switch (type) {
    default:
      return defaultReducerHandler();
  }
};

const constantReducer = ({
  type,
  state,
  action,
  // constants,
  resetState,
}) => {
  switch (type) {
    case RESET_INITIAL_STATE_DASHBOARD:
      return {
        ...state,
        ...resetState,
        ...action.payload,
      };
    case MUTATE_DASHBOARD_REDUCER:
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
  saga: DashSaga,
  reducer: DashReducer,
  hoc: DashboardHoc,
  hook: useDashboardHOC,
  ...DashHocProps
} = HOC({
  [INITIAL_STATE]: initialState,
  [REDUCER]: reducer,
  [REDUCER_CONSTANT]: constantReducer,
  [API_END_POINTS]: API_END_POINTS_CONFIG,
  [DONT_RESET_REDUCER_KEYS]: DONT_RESET_ON_LOGOUT_API_KEYS,
  [REDUCER_NAME]: DASHBOARD_REDUCER_NAME,
  [AXIOS_INTERCEPTORS]: axios,
  [GET_DEFAULT_CONFIG]: true,
});

export { DashSaga, DashReducer, DashboardHoc, useDashboardHOC, DashHocProps };
