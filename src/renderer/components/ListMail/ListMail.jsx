import React, { useState } from "react";
import {  GetSingleMail, } from "../../services";
import CardForMailList from "./CardForMailList";
import ListTopIcons from "./ListTopIcons";
import { useLocation } from "react-router-dom";
import ListBigCard from "./ListBigCard";
const { ImapFlow } = window.require("imapflow");
import { useDispatch } from "react-redux";
import { setAllMail, setEnvelope } from "../../redux/actions/MailList";
import {
  CheckForSelectedDiv,
  isFlagged,
  istoDay,
  UpdateTheArrayInLocalStorage,
} from "../../utils/provider/provider";
import { WriteFile } from "../../lib/fileAction";
const pathjoin = require("path");
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
  GridView,
  setGridView,
  isAnyMailOpen,
  user,
}) {
  const location = useLocation();
  let client_single;
  const dispatch = useDispatch();
  let path = location?.pathname == "/" ? "INBOX" : location?.state;

  async function UpdateAction(uid) {
    client_single = new ImapFlow(user);
    let mailreturned = await GetSingleMail(client_single, uid, path);
    if (mailreturned) {
      let { envelopedata, filteredData } = await UpdateTheArrayInLocalStorage(
        mailreturned,
        Data,
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

  function CheckFlag(data, flag) {
    let val = isFlagged(data, flag, message, location);
    if (val) {
      return val;
    }
  }

  return (
    <div className="  m-2 ">
      <div className="w-max flex ">
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
          GridView={GridView}
          setGridView={setGridView}
          message={message}
        />
      </div>
      <div
        className={
          GridView == 1
            ? `grid w-full  lg:grid-cols-3 md:grid-cols-2 grid-cols-1 ${
                isAnyMailOpen && "lg:grid-cols-2 md:grid-cols-1"
              } `
            : `w-full `
        }
      >
        {Data &&
          Data?.map((data, index) => {
            return (
              <>
                {GridView == 0 || GridView == 1 ? (
                  <CardForMailList
                    Data={data}
                    GridView={GridView}
                    setisAnyMailOpen={setisAnyMailOpen}
                    setopenedmail={setopenedmail}
                    username={data && data?.from[0]?.address}
                    body={data.subject}
                    subject={data && data?.sender[0]?.name}
                    time={istoDay(data)}
                    isstarred={CheckFlag(data, "flagged")}
                    messageId={data.messageId}
                    mailObject={data}
                    read={CheckFlag(data, "seen")}
                    key={index.toString()}
                    CheckForSelectedDiv={(val, id) => {
                      try {
                        CheckForSelectedDiv(
                          val,
                          id,
                          message,
                          UpdateAction,
                          user,
                          path
                        );
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                    setcomposeopen={setcomposeopen}
                  />
                ) : (
                  <ListBigCard
                    username={data && data?.from[0]?.address}
                    body={data.subject}
                    subject={data && data?.sender[0]?.name}
                    time={istoDay(data)}
                    isstarred={CheckFlag(data, "flagged")}
                    setisAnyMailOpen={setisAnyMailOpen}
                    setopenedmail={setopenedmail}
                    messageId={data.messageId}
                    mailObject={data}
                    read={CheckFlag(data, "seen")}
                    CheckForSelectedDiv={(val, id) => {
                      try {
                        CheckForSelectedDiv(
                          val,
                          id,
                          message,
                          UpdateAction,
                          user,
                          path
                        );
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                    key={index.toString()}
                    setcomposeopen={setcomposeopen}
                  />
                )}
              </>
            );
          })}
      </div>
    </div>
  );
}

export default ListMail;
