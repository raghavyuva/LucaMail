import { LoadingTypes } from "../constants/action-types";

const initialState = {
	loading: true,
};

export const loadingReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case LoadingTypes.SET_LOADING:
			return { ...state, loading: payload };
		default:
			return state;
	}
};
