import { APP_ACTIONS } from "../constants/action-types";

const initialState = {
  currentSideBar: null,
  folderStructure: null,
  MailStats: null,
};

export const appReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case APP_ACTIONS.SET_ACTIVE_SIDEBAR:
      return { ...state, currentSideBar: payload };
    case APP_ACTIONS.SET_FOLDER_STRUCTURE:
      return { ...state, folderStructure: payload };
    case APP_ACTIONS.SET_MAIL_STATS:
      return { ...state, MailStats: payload };
    default:
      return state;
  }
};
