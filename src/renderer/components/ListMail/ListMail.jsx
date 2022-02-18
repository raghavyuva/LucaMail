import React, { useState, useEffect } from "react";
import { config } from "../../static/constants/Config";
import { AddFlag, GetSingleMail, RemoveFlag } from "../../services";
import CardForMailList from "./CardForMailList";
import ListTopIcons from "./ListTopIcons";
import { useLocation } from "react-router-dom";
import { WriteFile } from "~/lib/fileAction";
const { ImapFlow } = window.require("imapflow");
const path = require("path");

function ListMail({
  Data,
  setisAnyMailOpen,
  setopenedmail,
  message,
  TotalCount,
  FetchLimit,
  FetchUptoNextLimit,
  toggle,
  settoggle,
  selected,
  setselected,
  Refresh,
  setcomposeopen,
  Body,
}) {
  let today = new Date();
  const location = useLocation();
  const [singleMail, setsingleMail] = useState();
  const [UpdatedMailStorage, setUpdatedMailStorage] = useState([]);
  const [envelope, setenvelope] = useState([]);

  function isFlagged(data, flag) {
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

  useEffect(() => {
    UpdateTheArrayInLocalStorage();
  }, [singleMail]);

  function UpdateTheArrayInLocalStorage() {
    if (singleMail) {
      let filteredData = message.filter((data) => {
        if (data.envelope?.messageId != singleMail.envelope?.messageId) {
          return data;
        }
      });
      filteredData.push(singleMail);
      if (filteredData?.length > 0) {
        filteredData.map((data) => {
          setUpdatedMailStorage((prevData) => [...prevData, data]);
        });
      }
    }
  }

  function CheckForSelectedDiv(m_id, todo) {
    for (let index = 0; index < message.length; index++) {
      const element = message[index];
      let path = location?.pathname == "/" ? "INBOX" : location?.state;
      if (m_id === element.envelope.messageId) {
        switch (todo) {
          case "star":
            const client = new ImapFlow(config);
            AddFlag("\\Flagged", path, element.uid, client);
            break;
          case "removestar":
            const cl = new ImapFlow(config);
            RemoveFlag(cl, element.uid, "\\Flagged", path);
            break;
          case "unread":
            const connection = new ImapFlow(config);
            RemoveFlag(connection, element.uid, "\\Seen", path);
            break;
          default:
            break;
        }
        setTimeout(() => {
          const client_single = new ImapFlow(config);
          GetSingleMail(client_single, element.uid, setsingleMail, path);
        }, 2000);
      }
    }
  }

  function istoDay(data) {
    let converted = new Date(data?.date);
    let val;
    if (converted?.toDateString() === today?.toDateString()) {
      val = converted?.toTimeString();
    } else {
      val = converted?.toDateString();
    }
    return val.slice(0, 8);
  }

  useEffect(() => {
    if (UpdatedMailStorage.length == message?.length) {
      UpdatedMailStorage?.map((d) => {
        setenvelope((prev) => [...prev, d?.envelope]);
      });
    }
  }, [UpdatedMailStorage]);

  useEffect(() => {
    if (envelope?.length == message?.length) {
      let obj = {};
      obj.Mail = UpdatedMailStorage;
      obj.Body = Body;
      WriteFile(path.join("mail", "mail"), obj);
    }
    return () => {};
  }, [envelope]);

  return (
    <div className="   ">
      <ListTopIcons
        Refresh={Refresh}
        toggle={toggle}
        settoggle={settoggle}
        selected={selected}
        setselected={setselected}
        TotalCount={TotalCount}
        FetchLimit={FetchLimit}
        FetchUptoNextLimit={FetchUptoNextLimit}
        Data={Data}
      />
      <div className="flex flex-col ">
        {Data &&
          Data?.map((data, index) => {
            return (
              <CardForMailList
                username={data && data?.from[0]?.address}
                body={data.subject}
                subject={data && data?.sender[0]?.name}
                time={istoDay(data)}
                isstarred={isFlagged(data, "flagged")}
                setisAnyMailOpen={setisAnyMailOpen}
                setopenedmail={setopenedmail}
                messageId={data.messageId}
                mailObject={data}
                read={isFlagged(data, "seen")}
                CheckForSelectedDiv={CheckForSelectedDiv}
                key={index.toString()}
                setcomposeopen={setcomposeopen}
              />
            );
          })}
      </div>
    </div>
  );
}

export default ListMail;
