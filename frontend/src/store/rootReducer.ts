import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/slice';
import usersReducer from '../features/users/slice';

const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
});

export default rootReducer;
