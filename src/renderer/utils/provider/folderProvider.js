import { checkExists, readFile } from "../../lib/fileAction";
import { FetchMail } from "../../services";
import { getInformation } from "../../services/flow";
const path = require("path");
const ImapFlow = require("imapflow");
export function GetUserHome() {
  try {
    let allusers = JSON.parse(readFile("userslist"));
    let userHome =
      allusers && allusers?.length > 0 ? allusers[0]?.auth?.user : "";
    return userHome;
  } catch (error) {
    console.log(error);
    return "";
  }
}

export function GetUser() {
  try {
    let allusers = JSON.parse(readFile("userslist"));
    return allusers && allusers?.length > 0 ? allusers[0] : "";
  } catch (error) {
    console.log(error);
    return false;
  }
}

export function GetFetchedCount(pathtocount) {
  try {
    return JSON.parse(readFile(pathtocount))
      ? JSON.parse(readFile(pathtocount))?.Mail?.length
      : 0;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export function Parser(pathtoparse) {
  try {
    return JSON.parse(readFile(pathtoparse))
      ? JSON.parse(readFile(pathtoparse))
      : 0;
  } catch (error) {
    return null;
  }
}

export async function GetFolderStructureFromServer(
  client,
  storepath,
  MailPath
) {
  if (!checkExists(storepath)) {
    let folder = await getInformation(client, MailPath, storepath);
    return folder;
  }
}

export const inboxpath = (userHome, val) => {
  switch (val) {
    case "conf":
      return path.join(userHome, "conf", "conf.txt");
    case "user":
      return path.join(userHome, "user.txt");
    case "mail":
      return path.join(userHome, "mail", "mail");
    default:
      return "";
  }
};

export async function CheckForMailExistense(userHome) {
  try {
    let mailfromlocal = Parser(userHome);
    if (mailfromlocal?.Mail?.length > 0 && mailfromlocal?.Body?.length > 0) {
      return mailfromlocal;
    }
  } catch (error) {
    console.log(error);
    return false
  }
}

export async function fetchMail(
  again,
  withlimit,
  data,
  MailPath,
  fLimit,
  fetchedCount,
  client
) {
  try {
    let { Messagesarray, envelopearray } = await FetchMail(
      client,
      fLimit,
      fetchedCount,
      withlimit,
      again,
      MailPath
    );
    if (envelopearray.length > 0 && Messagesarray.length > 0) {
      let converttojson = await JSON.stringify(Messagesarray, Set_toJSON);
      if (converttojson) {
        let parsedjson = await JSON.parse(converttojson);
        if (parsedjson) {
          let obj = {};
          obj.Mail = envelopearray;
          obj.Body = Messagesarray;
          obj.parsedjson = parsedjson;
          return obj;
        }
      }
    } else {
      console.log("nothing here");
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}
export function Set_toJSON(key, value) {
  if (typeof value === "object" && value instanceof Set) {
    return [...value];
  }
  return value;
}
