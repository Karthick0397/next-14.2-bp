import {
  bindActionsToDispatch,
  typeOf,
} from "react-boilerplate-redux-saga-hoc/utils";
import { AuthHocProps } from "./Authentication";
import { DashHocProps } from "./Dashboard";
import { TYPE_FUNCTION } from "react-boilerplate-redux-saga-hoc/constants";
import { store as _store } from "shared/utils/store";

const mutateState = (reducerName, store) => (payload) =>
  store.dispatch({
    type: `${reducerName}_MUTATE_STATE`,
    payload:
      typeOf(payload) === TYPE_FUNCTION ? payload(store.getState()) : payload,
  });

export const AuthenticationHocProps = () => {
  const store = global.__REDUX_STORE__ || _store;
  return {
    ...AuthHocProps,
    actions: bindActionsToDispatch(AuthHocProps.actions, store.dispatch),
    mutateState: mutateState(AuthHocProps.reducerName, store),
    getState: store.getState,
    store,
  };
};

export const DashboardHocProps = () => {
  const store = global.__REDUX_STORE__ || _store;
  return {
    ...DashHocProps,
    actions: bindActionsToDispatch(DashHocProps.actions, store.dispatch),
    mutateState: mutateState(DashHocProps.reducerName, store),
    getState: store.getState,
    store,
  };
};
