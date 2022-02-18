import { MailType } from "../constants/action-types";

export const setAllMail = (maillist) => {

    return {
        type: MailType.SET_ALL_MAILS,
        payload: maillist,
    };
};


export const setEnvelope = (envelope) => {
    return {
        type: MailType.SET_ENVELOPE,
        payload: envelope,
    };
};