import { DEFAULT_THEME } from "../../themes";
import { ThemeTypes } from "../constants/action-types";

const initialState = {
	theme: DEFAULT_THEME,
};

export const themeReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case ThemeTypes.SET_THEME:
			return { ...state, theme: payload };
		default:
			return state;
	}
};
