import { MailType } from "../constants/action-types";

const initialState = {
    maillist: [],
    Envelope: []
};

export const mailReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case MailType.SET_ALL_MAILS:
            return { ...state, maillist: payload };
        case MailType.SET_ENVELOPE:
            return { ...state, Envelope: payload };
        default:
            return state;
    }
};
