import { settingsType } from "../constants/action-types";
// import { GET_FROM_LOCAL_STORAGE } from "../../constants/LocalStorage";
// const { prefer_type } = GET_FROM_LOCAL_STORAGE;

const initialState = {
	// prefer_type: prefer_type ? prefer_type : "day_night",
	prefer_type:"day_night"
};

export const settingsReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case settingsType.general.THEME_PREFERENCE:
			return { ...state, prefer_type: payload };
		default:
			return state;
	}
};
