import { UserTypes } from "../constants/action-types";

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
