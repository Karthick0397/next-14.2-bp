import { nextStore as createStore } from "react-boilerplate-redux-saga-hoc";
import { AuthSaga, AuthReducer } from "shared/hoc/Authentication";
import { DashSaga, DashReducer } from "shared/hoc/Dashboard";
const INITIAL_STATE = {};
export const Store = createStore({
  saga: [AuthSaga, DashSaga],
  reducer: [AuthReducer, DashReducer],
});
export const store = Store(INITIAL_STATE);
