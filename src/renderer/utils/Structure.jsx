import React, { useState } from "react";
import ListMail from "../components/ListMail/ListMail";
import ShowMail from "../components/ShowMail/ShowMail";
import SideBar from "../components/SideBar/SideBarWrapper";
import TopBar from "../components/TopBar/TopBar";
import SelfPromotional from "../components/Promotional/Promote";
import TitleBar from "~/components/TopBar/WindowBar";
import { EditorState } from "draft-js";
import useComponentVisible from "./TouchBehaviour";
import { MdMenu } from "react-icons/md";
import { SettingTypes } from "~/static/constants/Settings";
import ComposeBox from "~/components/ShowMail/ComposeBox";
import FilterCard from "~/components/TopBar/FilterCard";
import { readFile } from "../lib/fileAction";
const path = require("path");
function Structure({
  isAnyMailOpen,
  setisAnyMailOpen,
  Tabs,
  Data,
  theme,
  openedmail,
  setopenedmail,
  composeopen,
  setcomposeopen,
  unseenCount,
  listOfUid,
  message,
  Quota,
  actionFromReply,
  setactionFromReply,
  searchText,
  setsearchText,
  search,
  FilteredData,
  Status,
  FetchLimit,
  FetchUptoNextLimit,
  Refresh,
  MailStats,
  folderStructure,
}) {
  const [toggle, settoggle] = useState(false);
  const [selected, setselected] = useState();
  const { ref } = useComponentVisible(false, toggle, settoggle);
  let SettingFromStorage = JSON.parse(localStorage.getItem("Settings"));

  const [isDrawerOpen, setisDrawerOpen] = useState(
    SettingFromStorage
      ? SettingFromStorage[0].default
      : SettingTypes["boolvaled"][0].default
  );
  const [HideTopbar] = useState(
    SettingFromStorage
      ? SettingFromStorage[3].default
      : SettingTypes["boolvaled"][3].default
  );
  const [showSupportCard] = useState(
    SettingFromStorage
      ? SettingFromStorage[1].default
      : SettingTypes["boolvaled"][1].default
  );

  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );

  function OnFilterSelection(selected) {
    setselected(selected);
    if (selected) {
      switch (selected) {
        case "A-Z":
          Data.sort((a, b) => a.subject.localeCompare(b.subject));
          break;
        case "Z-A":
          Data.sort((a, b) => a.subject.localeCompare(b.subject))?.reverse();
          break;
        case "sent-by":
          Data.sort((a, b) =>
            a.from[0].address.localeCompare(b.from[0].address)
          );
          break;
        default:
          Data?.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
          });
          break;
      }
    }
  }

  return (
    <div>
      <TitleBar
        Icon={MdMenu}
        isDrawerOpen={isDrawerOpen}
        setisDrawerOpen={setisDrawerOpen}
      />
      <div className=" flex h-[calc(100vh_-_2rem)] ">
        <div ref={ref} className=" overflow-hidden">
          {toggle && (
            <FilterCard
              toggle={toggle}
              settoggle={settoggle}
              selected={selected}
              setselected={setselected}
              onFilterSelection={(val) => OnFilterSelection(val)}
            />
          )}
          <div>
            {isDrawerOpen && (
              <SideBar
                isDrawerOpen={isDrawerOpen}
                setisDrawerOpen={setisDrawerOpen}
                setcomposeopen={setcomposeopen}
                composeopen={composeopen}
                actionFromReply={actionFromReply}
                setactionFromReply={setactionFromReply}
                isAnyMailOpen={isAnyMailOpen}
                showSupportCard={showSupportCard}
                folderStructure={folderStructure}
              />
            )}
          </div>
        </div>
        <div className="flex-1 flex-col flex overflow-hidden ">
          {!HideTopbar && (
            <TopBar
              isDrawerOpen={isDrawerOpen}
              setisDrawerOpen={setisDrawerOpen}
              theme={theme}
              Quota={Quota && Quota}
              searchText={searchText}
              setsearchText={setsearchText}
              search={search}
              selection={selected}
              setselection={setselected}
              toggled={toggle}
              settoggled={settoggle}
              uname={MailStats?.user}
            />
          )}
          <div className="flex flex-1 flex-row overflow-hidden  ">
            {Data?.length > 0 && (
              <div className=" overflow-y-scroll  scroll-smooth    w-max justify-center items-center scrollbar-thin scrollbar-thumb-primary scrollbar-track-secondary  scrollbar-thumb-rounded-full scrollbar-track-rounded-full ">
                <ListMail
                  Data={
                    FilteredData && FilteredData?.length > 0
                      ? FilteredData
                      : Data
                  }
                  Tabs={Tabs}
                  isAnyMailOpen={isAnyMailOpen}
                  setisAnyMailOpen={setisAnyMailOpen}
                  openedmail={openedmail}
                  setopenedmail={setopenedmail}
                  unseenCount={unseenCount}
                  message={message}
                  TotalCount={Status}
                  FetchLimit={FetchLimit}
                  FetchUptoNextLimit={FetchUptoNextLimit}
                  setcomposeopen={setcomposeopen}
                  Refresh={Refresh}
                />
              </div>
            )}
            {isAnyMailOpen ? (
              <div className=" overflow-y-scroll no-scrollbar w-full ">
                <ShowMail
                  openedmail={openedmail}
                  setopenedmail={setopenedmail}
                  composeopen={composeopen}
                  setcomposeopen={setcomposeopen}
                  listOfUid={listOfUid}
                  message={message}
                  actionFromReply={actionFromReply}
                  setactionFromReply={setactionFromReply}
                  maillist={Data}
                  pathContents={
                    MailStats
                      ? MailStats
                      : JSON.parse(readFile(path.join("conf", "conf.txt")))
                  }
                />
              </div>
            ) : (
              <>
                {!composeopen ? (
                  <div className=" overflow-y-scroll scrollbar-thin scrollbar-thumb-primary scrollbar-track-secondary w-full md:flex hidden  ">
                    <SelfPromotional
                      uname={MailStats?.user ? MailStats?.user : ""}
                      Data={message}
                      composeopen={composeopen}
                      setcomposeopen={setcomposeopen}
                    />
                  </div>
                ) : (
                  <div className=" w-full   mx-10">
                    <ComposeBox
                      editorState={editorState}
                      setEditorState={setEditorState}
                      composeopen={composeopen}
                      setcomposeopen={setcomposeopen}
                      toadress=""
                      subject=""
                      action={actionFromReply}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Structure;
