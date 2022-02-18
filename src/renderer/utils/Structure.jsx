import React, { useState, useEffect } from "react";
import ListMail from "../components/ListMail/ListMail";
import ShowMail from "../components/ShowMail/ShowMail";
import SideBar from "../components/SideBar/SideBarWrapper";
import TopBar from "../components/TopBar/TopBar";
import PropTypes from "prop-types";
import SelfPromotional from "../components/Promotional/Promote";
import TitleBar from "~/components/TopBar/WindowBar";
import { SideBarContents } from "../components/SideBar/constant";
import { motion } from "framer-motion";
import { EditorState } from "draft-js";
import useComponentVisible from "./TouchBehaviour";
import { MdMenu } from "react-icons/md";
import { SettingTypes } from "~/static/constants/Settings";
import ComposeBox from "~/components/ShowMail/ComposeBox";
import FilterCard from "~/components/TopBar/FilterCard";
import { config } from "../static/constants/Config";
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
  MailWithBody,
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
  ConfData,
}) {
  let uname = ConfData.user;
  const [toggle, settoggle] = useState(false);
  const [selected, setselected] = useState();
  const [LocalFilterData, setLocalFilterData] = useState(
    FilteredData && FilteredData?.length > 0 ? FilteredData : Data
  );
  const [backupData, setbackupData] = useState(LocalFilterData);
  const [changedetect, setchangedetect] = useState(0);
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

  const [SidebarItem, setSidebarItem] = useState(
    ConfData ? ConfData : JSON.parse(readFile(path.join("conf", "conf.txt")))
  );

  useEffect(() => {
    setLocalFilterData(
      FilteredData && FilteredData?.length > 0 ? FilteredData : Data
    );
  }, [Data]);

  useEffect(() => {
    if (selected) {
      SetBack(FilteredData && FilteredData?.length > 0 ? FilteredData : Data);
      switch (selected) {
        case "A-Z":
          let filteredval = LocalFilterData.sort((a, b) =>
            a.subject.localeCompare(b.subject)
          );
          SetBack(filteredval);
          break;
        case "Z-A":
          let val = LocalFilterData.sort((a, b) =>
            a.subject.localeCompare(b.subject)
          );
          SetBack(val?.reverse());
          break;
        case "sent-by":
          let v = LocalFilterData.sort((a, b) =>
            a.from[0].address.localeCompare(b.from[0].address)
          );
          SetBack(v);
          break;
        default:
          let c = LocalFilterData?.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
          });
          SetBack(c);
          break;
      }
    }
  }, [selected]);

  useEffect(() => {}, [changedetect]);

  function SetBack(val) {
    setchangedetect(changedetect + 1);
    setLocalFilterData(val);
  }

  useEffect(() => {
    setbackupData(LocalFilterData);
  }, [LocalFilterData]);

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
            />
          )}
          <motion.div
            animate={{ x: isDrawerOpen ? 0 : -100 }}
            transition={{ ease: "easeInOut", duration: 3 }}
          >
            {isDrawerOpen && (
              <SideBar
                sideBarContents={ConfData ? ConfData : SideBarContents}
                isDrawerOpen={isDrawerOpen}
                setisDrawerOpen={setisDrawerOpen}
                setcomposeopen={setcomposeopen}
                composeopen={composeopen}
                actionFromReply={actionFromReply}
                setactionFromReply={setactionFromReply}
                isAnyMailOpen={isAnyMailOpen}
                showSupportCard={showSupportCard}
              />
            )}
          </motion.div>
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
              uname={uname}
            />
          )}
          <div className="flex flex-1 flex-row overflow-hidden  ">
            {Data?.length > 0 && (
              <div className=" overflow-y-scroll  scroll-smooth    w-max justify-center items-center scrollbar-thin scrollbar-thumb-primary scrollbar-track-secondary  scrollbar-thumb-rounded-full scrollbar-track-rounded-full ">
                <ListMail
                  Data={
                    FilteredData && FilteredData?.length > 0
                      ? FilteredData
                      : backupData
                  }
                  Tabs={Tabs}
                  isAnyMailOpen={isAnyMailOpen}
                  setisAnyMailOpen={setisAnyMailOpen}
                  openedmail={openedmail}
                  setopenedmail={setopenedmail}
                  unseenCount={unseenCount}
                  message={message}
                  Body={MailWithBody}
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
                  MailWithBody={MailWithBody}
                  listOfUid={listOfUid}
                  message={message}
                  actionFromReply={actionFromReply}
                  setactionFromReply={setactionFromReply}
                  maillist={Data}
                  pathContents={SidebarItem ? SidebarItem : SideBarContents}
                />
              </div>
            ) : (
              <>
                {!composeopen ? (
                  <div className=" overflow-y-scroll scrollbar-thin scrollbar-thumb-primary scrollbar-track-secondary w-full md:flex hidden  ">
                    <SelfPromotional
                      uname={uname}
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

Structure.propTypes = {
  showSidebar: PropTypes.bool,
  showTopbar: PropTypes.bool,
  isDrawerOpen: PropTypes.bool,
  setisDrawerOpen: PropTypes.func,
  sideBarContents: PropTypes.array,
  isAnyMailOpen: PropTypes.bool,
  setisAnyMailOpen: PropTypes.func,
};

export default Structure;
