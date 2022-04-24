import React, { useState } from "react";
import {
  istoDay,
  UpdateTheArrayInLocalStorage,
} from "../../utils/provider/provider";
import TableData from "./TableData";
import { ListOpenedBar } from "../../static/constants/ListTopContents";
import { AddFlag, GetSingleMail, MoveToFolder } from "../../services";
import { WriteFile } from "../../lib/fileAction";
import { MdDownload } from "react-icons/md";
const { ImapFlow } = require("imapflow");
const { contents } = ListOpenedBar;
const pathjoin = require("path");
const TableView = ({ params }) => {
  const { Envelope, message, user, path, pathContents,onDownloadAsCsv } = params;
  const [Data, setData] = useState(Envelope);
  const [allselected, setallselected] = useState(false);
  let pathname = path == "/" ? "INBOX" : path;
  async function onTopIconsClick(itm) {
    let filtereddata = Data.filter((ele) => {
      return ele.checked == true;
    });
    if (filtereddata?.length > 0) {
      let uidarray = [];
      message?.filter((data) => {
        filtereddata?.map((env) => {
          if (env?.messageId == data?.envelope?.messageId) {
            uidarray.push(data?.uid);
          }
        });
      });
      let returned;
      switch (itm) {
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
          MoveToFolder(connection, pathname, destpath, uidarray);
          break;
        case "star":
          const client = new ImapFlow(user);
          returned = await AddFlag("\\Flagged", "INBOX", uidarray, client);
          break;
        case "archive":
          const x = new ImapFlow(user);
          returned = await AddFlag("Archive", pathname, uidarray, x);
          break;
        case "spam":
          const con = new ImapFlow(user);
          returned = await AddFlag("$Phishing", pathname, uidarray, con);
          break;
        default:
          alert("invalid action");
          break;
      }
    } else {
      alert("select one or more messages");
    }
  }
  return (
    <section className="w-full bg-MailCardBackground text-text px-4">
      <div className="flex flex-col ">
        <div className="w-full mt-4 mx-auto bg-white shadow-2xl rounded-sm  ">
          <div className="flex">
            {contents?.map((ele) => (
              <ele.icon
                size={25}
                className="mr-4 cursor-pointer"
                onClick={() => {
                  onTopIconsClick(ele.func);
                }}
              />
            ))}
            <MdDownload size={25} onClick={onDownloadAsCsv} />
          </div>
          <div className="p-3">
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="text-xs font-semibold uppercase text-gray-400 bg-windowBarBackground">
                  <tr>
                    <th className="sticky left-0 px-4 py-2 text-left bg-gray-50">
                      <label className="sr-only" for="row_all">
                        Select All
                      </label>
                      <input
                        className="w-3 h-3 border-gray-200 rounded"
                        type="checkbox"
                        id="row_all"
                        value={allselected}
                        onChange={(e) => {
                          if (e.target.checked === true) {
                            Data?.map((el) => {
                              el.checked = true;
                            });
                            setallselected(true);
                          } else {
                            Data?.map((el) => {
                              el.checked = false;
                            });
                            setallselected(false);
                          }
                        }}
                      />
                    </th>
                    <th className="p-2 flex whitespace-nowrap ">
                      <div className="font-semibold text-left">Name</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Email</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Message</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-right">Recieved</div>
                    </th>
                  </tr>
                </thead>
                {Data?.map((data) => {
                  return (
                    <TableData
                      username={data && data?.from[0]?.address}
                      body={data.subject}
                      subject={data && data?.sender[0]?.name}
                      time={istoDay(data)}
                      selected={data.checked ? data?.checked : false}
                      data={data}
                      setData={setData}
                      Data={Data}
                      setallselected={setallselected}
                    />
                  );
                })}
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TableView;
