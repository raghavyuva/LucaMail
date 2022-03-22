import { UsersList, UserTypes } from "../constants/action-types";

const initialState = {
  user: null,
  Authenticated: false,
  userslist: null,
};

export const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case UserTypes.SET_USER:
      return { ...state, user: payload };
    case UserTypes.SET_AUTHENTICATED:
      return { ...state, Authenticated: payload };
    case UsersList.SET_USERS:
      return { ...state, userslist: payload };
    default:
      return state;
  }
};
