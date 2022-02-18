import { LoadingTypes } from "../constants/action-types";

export const setLoading = (loading) => {
	return {
		type: LoadingTypes.SET_LOADING,
		payload: loading,
	};
};
