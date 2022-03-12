import React from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { WriteFile } from "~/lib/fileAction";
import { AddFlag, MoveToFolder } from "~/services";
import { setAllMail, setEnvelope } from "../../redux/actions/MailList";
import { GetSingleMail } from "../../services";
import { UpdateTheArrayInLocalStorage } from "../../utils/provider/provider";
const { ImapFlow } = window.require("imapflow");
const { ipcRenderer } = require("electron");
const ipc = ipcRenderer;
const pathjoin = require("path");
function ShowTopIcons({
  Icon,
  func,
  id,
  ActiveMail,
  setActiveMail,
  setopenedmail,
  ActiveIndex,
  maillist,
  message,
  pathContents,
  userHome,
  user,
  envelope,
}) {
  const location = useLocation();
  let path = location?.pathname == "/" ? "INBOX" : location?.state;
  let client_single;
  const dispatch = useDispatch();

  function ForawrdBackward(move) {
    if (move == "forward") {
      for (let index = 0; index < message?.length; index++) {
        if (
          message[index]?.envelope?.messageId === ActiveMail?.messageId &&
          ActiveIndex + 1 < message?.length
        ) {
          const element = message[index + 1];
          setopenedmail(element?.envelope);
        }
      }
    } else {
      for (let index = 0; index < message.length; index++) {
        if (
          message[index]?.envelope?.messageId === ActiveMail?.messageId &&
          ActiveIndex - 1 < message?.length &&
          ActiveIndex != 0
        ) {
          const element = message[index - 1];
          setopenedmail(element?.envelope);
        }
      }
    }
  }

  // function RemoveFromStore() {
  //   let listupdated = MailWithBody?.filter((el) => {
  //     if (el.messageId != ActiveMail?.messageId) {
  //       return el;
  //     }
  //   });
  //   let updatedmail = maillist?.filter((el) => {
  //     if (el.messageId != ActiveMail?.messageId) {
  //       return el;
  //     }
  //   });
  //   let updatedmessage = message?.filter((el) => {
  //     if (el.envelope.messageId != ActiveMail.messageId) {
  //       return el;
  //     }
  //   });
  //   if (
  //     listupdated?.length == MailWithBody?.length - 1 &&
  //     updatedmail?.length == maillist?.length - 1 &&
  //     updatedmessage?.length == message?.length - 1
  //   ) {
  //     let obj = {};
  //     obj.Mail = updatedmessage;
  //     obj.Body = listupdated;
  //     WriteFile(Path.join(userHome, "mail", "mail"), obj);
  //   }
  // }
  let returned;

  async function SelectFunction(func) {
    switch (func) {
      case "delete":
        break;
      case "spam":
        const con = new ImapFlow(user);
        returned = await AddFlag("$Phishing", path, id, con);
        UpdateAction(id);
        break;
      case "star":
        const client = new ImapFlow(user);
        returned = await AddFlag("\\Flagged", path, id, client);
        UpdateAction(id);
        break;
      case "backward":
        ForawrdBackward("backward");
        break;
      case "forward":
        ForawrdBackward("forward");
        break;
      case "archive":
        const x = new ImapFlow(user);
        returned = await AddFlag("Archive", path, id, x);
        UpdateAction(id);
        break;
      default:
        alert("invalid function to handle");
        break;
    }
  }

  async function UpdateAction(uid, changepath) {
    client_single = new ImapFlow(user);
    let mailreturned = await GetSingleMail(client_single, uid, path);
    if (mailreturned) {
      let { envelopedata, filteredData } = await UpdateTheArrayInLocalStorage(
        mailreturned,
        maillist,
        message
      );
      if (envelopedata && filteredData) {
        dispatch(setEnvelope(envelopedata));
        dispatch(setAllMail(filteredData));
        StoreAsFile(filteredData, envelopedata);
      }
    }
  }

  function StoreAsFile(filteredData, envelopedata) {
    let obj = {};
    obj.Mail = envelopedata;
    obj.Body = filteredData;
    WriteFile(pathjoin.join(user?.auth?.user, "mail", "mail"), obj);
  }

  return (
    <div
      className=" cursor-pointer"
      title={func}
      onClick={() => SelectFunction(func)}
    >
      {
        <Icon
          size={35}
          className="text-DisplayMailTopIcon  mr-4 bg-DisplayMailTopIconBackground p-2 rounded-lg"
        />
      }
    </div>
  );
}

export default ShowTopIcons;
