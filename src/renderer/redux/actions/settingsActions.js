import { settingsType } from "../constants/action-types";

export const setThemePreference = (prefer_type) => {
	return {
		type: settingsType.general.THEME_PREFERENCE,
		payload: prefer_type,
	};
};
