import { ThemeTypes } from "../constants/action-types";

export const setTheme = (theme) => {
	return {
		type: ThemeTypes.SET_THEME,
		payload: theme,
	};
};
