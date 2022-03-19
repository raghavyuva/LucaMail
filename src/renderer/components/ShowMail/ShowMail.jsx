import React, { useEffect, useState } from "react";
import { ListOpenedBar } from "../../static/constants/ListTopContents";
import { EditorState } from "draft-js";

import { AddSeenFlag, GetSingleMail } from "../../services";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import ShowTopIcons from "./ShowTopIcons";
import DisplayMails from "./DisplayMails";
import ComposeBox from "./ComposeBox";
import { useLocation } from "react-router-dom";
import { createFolder, WriteFile } from "~/lib/fileAction";
import {
  isFlagged,
  UpdateTheArrayInLocalStorage,
} from "../../utils/provider/provider";
const { ImapFlow } = window.require("imapflow");
const os = require("os");
const homedir = os.homedir();
var fs = require("fs");
const path = require("path");
let appPath = "luca";
function ShowMail({
  openedmail,
  setopenedmail,
  composeopen,
  setcomposeopen,
  message,
  actionFromReply,
  setactionFromReply,
  maillist,
  pathContents,
  setisAnyMailOpen,
  userHome,
  user,
}) {
  const { contents, rightcontent } = ListOpenedBar;
  const [ActiveMail, setActiveMail] = useState(null);
  const [Uid, setUid] = useState(undefined);
  const [ActiveIndex, setActiveIndex] = useState(0);
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );
  const location = useLocation();
  let paths = location?.pathname == "/" ? "INBOX" : location?.state;
  let client, client_single;

  useEffect(() => {
    for (let index = 0; index < message?.length; index++) {
      if (message[index]?.envelope?.messageId === openedmail?.messageId) {
        setActiveIndex(index);
        setActiveMail(message[index]?.body);
        if (
          ActiveMail &&
          !isFlagged(message[index]?.envelope, "seen", message, location)
        ) {
          client = new ImapFlow(user);
          client_single = new ImapFlow(user);
          AddSeenFlag(client, Uid, paths);
          RetrieveMail();
        }
        for (let x = 0; x < message?.length; x++) {
          const element = message[x];
          if (element.envelope?.messageId === message[index]?.body?.messageId) {
            setUid(element.uid);
          }
        }
      }
    }
  }, [openedmail, ActiveMail, message, ActiveIndex]);

  async function RetrieveMail() {
    let mailreturned = await GetSingleMail(client_single, Uid, paths);
    if (mailreturned) {
      let { envelopedata, filteredData } = await UpdateTheArrayInLocalStorage(
        mailreturned,
        maillist,
        message
      );
      if (envelopedata && filteredData) {
        console.log("storing");
        StoreAsFile(filteredData, envelopedata);
      }
    }
  }

  function StoreAsFile(filteredData, envelopedata) {
    let obj = {};
    obj.Mail = envelopedata;
    obj.Body = filteredData;
    WriteFile(path.join(user?.auth?.user, "mail", "mail"), obj);
  }

  function DownloadAttachMents(attachement) {
    try {
      if (attachement) {
        const downloadPath = path.join(homedir, appPath, userHome, "downloads");
        if (!fs.existsSync(downloadPath)) {
          createFolder(path.join(userHome, "downloads"));
        }
        let fileName = attachement.filename;
        const buff = Buffer.from(attachement?.content);
        const stream = fs
          .createWriteStream(path.join(downloadPath, fileName))
          .write(buff);
        alert("download success");
      }
    } catch (error) {
      alert("error downloading");
    }
  }
  return (
    <div className="p-2 bg-background">
      <div className="flex flex-row justify-between items-center mt-3  ">
        <div className="flex ">
          {contents?.map((item) => (
            <ShowTopIcons
              Icon={item.icon}
              func={item.func}
              id={Uid}
              ActiveMail={ActiveMail}
              maillist={maillist}
              message={message}
              pathContents={pathContents}
              userHome={userHome}
              user={user}
            />
          ))}
        </div>
        <div className="mr-11 flex-row flex">
          <div className="flex">
            {rightcontent?.map((item) => (
              <ShowTopIcons
                Icon={item.icon}
                func={item.tooltip}
                ActiveMail={ActiveMail}
                setActiveMail={setActiveMail}
                setopenedmail={setopenedmail}
                ActiveIndex={ActiveIndex}
                message={message}
                userHome={userHome}
                user={user}
                maillist={maillist}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="p-2 mt-2">
        {ActiveMail && (
          <DisplayMails
            Html={ActiveMail.html}
            time={ActiveMail?.date?.toString()}
            username={ActiveMail.from.value[0].name}
            subject={ActiveMail.subject}
            text={ActiveMail.textAsHtml}
            fromhtml={ActiveMail.from.html}
            from={ActiveMail.from.value[0].address}
            mailinfo={ActiveMail?.headerLines}
            currMail={ActiveMail}
            setcomposeopen={setcomposeopen}
            composeopen={composeopen}
            setactionFromReply={setactionFromReply}
            actionFromReply={actionFromReply}
            DownloadAttachMents={(file) => {
              DownloadAttachMents(file);
            }}
            setisAnyMail={setisAnyMailOpen}
           
          />
        )}
      </div>
      {composeopen && (
        <div className="w-11/12">
          <div className="absolute bottom-4   right-8 ">
            <div className="flex flex-row justify-center self-center items-center  ">
              <ComposeBox
                editorState={editorState}
                setEditorState={setEditorState}
                composeopen={composeopen}
                setcomposeopen={setcomposeopen}
                toadress={ActiveMail?.from.value[0].address}
                subject={ActiveMail.subject}
                action={actionFromReply}
                userHome={userHome}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowMail;
