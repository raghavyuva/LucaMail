import { APP_ACTIONS } from "../constants/action-types";

export const setActiveSideBar = (active) => {
  return {
    type: APP_ACTIONS.SET_ACTIVE_SIDEBAR,
    payload: active,
  };
};

export const setFolderStrucure = (structure) => {
  return {
    type: APP_ACTIONS.SET_FOLDER_STRUCTURE,
    payload: structure,
  };
};

export const setMailStats = (stat) => {
  return {
    type: APP_ACTIONS.SET_MAIL_STATS,
    payload: stat,
  };
};
