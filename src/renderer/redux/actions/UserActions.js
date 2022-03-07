import { UsersList, UserTypes } from "../constants/action-types";

export const setUser = (user) => {
  return {
    type: UserTypes.SET_USER,
    payload: user,
  };
};

export const setAuthenticated = (value) => {
  return {
    type: UserTypes.SET_AUTHENTICATED,
    payload: value,
  };
};

export const setUsersList = (users) => {
  return {
    type: UsersList.SET_USERS,
    payload: users,
  };
};
