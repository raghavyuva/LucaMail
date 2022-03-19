import React from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { WriteFile } from "~/lib/fileAction";
import { AddFlag, MoveToFolder } from "~/services";
import { setAllMail, setEnvelope } from "../../redux/actions/MailList";
import { GetSingleMail, } from "../../services";
import { UpdateTheArrayInLocalStorage } from "../../utils/provider/provider";
const { ImapFlow } = window.require("imapflow");
const pathjoin = require("path");
function ShowTopIcons({
  Icon,
  func,
  id,
  ActiveMail,
  setopenedmail,
  ActiveIndex,
  maillist,
  message,
  pathContents,
  user,
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

  let returned;

  async function SelectFunction(func) {
    switch (func) {
      case "delete":
        const connection = new ImapFlow(user);
        let destpath;
        pathContents?.folderTree?.map((folder) => {
          if (folder?.folders) {
            folder?.folders?.map((folders) => {
              if (
                folders?.path.toLowerCase().includes("trash") ||
                folders?.path.toLowerCase().includes("bin")
              ) {
                destpath = folders.path;
              }
            });
          } else {
            if (
              folder?.path.toLowerCase().includes("trash") ||
              folder?.path.toLowerCase().includes("bin")
            ) {
              destpath = folder.path;
            }
          }
        });
        MoveToFolder(connection, path, destpath, id);
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
