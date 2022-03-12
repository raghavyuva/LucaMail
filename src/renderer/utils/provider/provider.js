import { AddFlag, RemoveFlag } from "../../services";

const { ImapFlow } = window.require("imapflow");
let client;
export function istoDay(data) {
  let today = new Date();

  let converted = new Date(data?.date);
  let val;
  if (converted?.toDateString() === today?.toDateString()) {
    val = converted?.toTimeString();
  } else {
    val = converted?.toDateString();
  }
  return val.slice(0, 8);
}

export async function CheckForSelectedDiv(
  m_id,
  todo,
  message,
  UpdateAction,
  user,
  path
) {
  for (let index = 0; index < message.length; index++) {
    const element = message[index];
    if (m_id === element.envelope.messageId) {
      switch (todo) {
        case "star":
          client = new ImapFlow(user);
          let returned = await AddFlag("\\Flagged", path, element?.uid, client);
          UpdateAction(element?.uid);
          break;
        case "removestar":
          client = new ImapFlow(user);
          let val = await RemoveFlag(client, element?.uid, "\\Flagged", path);
          UpdateAction(element?.uid);
          break;
        case "unread":
          console.log("unread");
          client = new ImapFlow(user);
          let removed = await RemoveFlag(client, element?.uid, "\\Seen", path);
          console.log(removed, "wh");
          UpdateAction(element?.uid);
          break;
        case "seen":
          client = new ImapFlow(user);
          let value = await AddFlag("\\Seen", path, element?.uid, client);
          UpdateAction(element?.uid);
          break;
        default:
          console.log("ehwe");
          break;
      }
    }
  }
}

export async function UpdateTheArrayInLocalStorage(singlemail, Data, message) {
  if (singlemail && Object.values(singlemail)?.length > 0) {
    let filteredData = message.filter((data) => {
      if (data?.envelope?.messageId != singlemail?.envelope?.messageId) {
        return data;
      }
    });
    filteredData.push(singlemail);
    console.log(singlemail);
    let envelopedata = Data?.filter((data) => {
      if (data?.messageId != singlemail?.envelope?.messageId) {
        return data;
      }
    });
    envelopedata.push(singlemail?.envelope);
    if (filteredData?.length > 0 && envelopedata?.length > 0) {
      return { envelopedata, filteredData };
    }
  }
}

export function isFlagged(data, flag, message, location) {
  let boolval = false;
  let x = [];
  if (location.pathname.toLowerCase() != "/") {
    for (let index = 0; index < message?.length; index++) {
      const element = message[index];
      if (element.envelope?.messageId === data?.messageId) {
        element?.flags?.forEach((e) => {
          x.push(e);
        });
        if (x?.length > 0) {
          for (let i = 0; i < x.length; i++) {
            let va = x[i];
            if (va.toLowerCase().includes(flag)) {
              boolval = true;
            }
          }
        }
      }
    }
    return boolval;
  } else {
    for (let index = 0; index < message?.length; index++) {
      const element = message[index];
      if (element.envelope?.messageId === data?.messageId) {
        if (Object.keys(element.flags).length >= 1) {
          let val = Object.values(element.flags);
          val.forEach((f) => {
            if (f.toLowerCase().includes(flag)) {
              boolval = true;
            }
          });
        } else {
          return false;
        }
      }
    }
    return boolval;
  }
}
