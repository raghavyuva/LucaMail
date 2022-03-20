import React, { useState } from "react";
import { MdMenu } from "react-icons/md";
import ShowMail from "../components/ShowMail/ShowMail";
import SideBarWrapper from "../components/SideBar/SideBarWrapper";
import FilterCard from "../components/TopBar/FilterCard";
import TopBar from "../components/TopBar/TopBar";
import Windowbar from "../components/TopBar/WindowBar";
import { SettingTypes } from "../static/constants/Settings";
import useComponentVisible from "./TouchBehaviour";
const path = require("path");

const PageLayout = ({
  isAnyMailOpen,
  setisAnyMailOpen,
  Data,
  openedmail,
  setopenedmail,
  composeopen,
  setcomposeopen,
  listOfUid,
  message,
  Quota,
  actionFromReply,
  setactionFromReply,
  MailStats,
  folderStructure,
  userHome,
  userslist,
  user,
  Component,
  searchText,
  setsearchText,
  search,
}) => {
  const [toggle, settoggle] = useState(false);
  const [selected, setselected] = useState();
  const { ref } = useComponentVisible(false, toggle, settoggle);
  let SettingFromStorage = JSON.parse(localStorage.getItem("Settings"));
  const [ModalOpen, setModalOpen] = useState(false);
  const [isDrawerOpen, setisDrawerOpen] = useState(
    SettingFromStorage
      ? SettingFromStorage[0]?.defaultval
      : SettingTypes["boolvaled"][0]?.defaultval
  );
  const [HideTopbar] = useState(
    SettingFromStorage
      ? SettingFromStorage[3]?.defaultval
      : SettingTypes["boolvaled"][3]?.defaultval
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
      <Windowbar
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
              <SideBarWrapper
                isDrawerOpen={isDrawerOpen}
                setisDrawerOpen={setisDrawerOpen}
                setcomposeopen={setcomposeopen}
                composeopen={composeopen}
                actionFromReply={actionFromReply}
                setactionFromReply={setactionFromReply}
                isAnyMailOpen={isAnyMailOpen}
                showSupportCard={true}
                folderStructure={folderStructure}
                userHome={userHome}
                user={user}
              />
            )}
          </div>
        </div>
        <div className="flex-1 flex-col flex overflow-hidden ">
          {!HideTopbar && (
            <TopBar
              isDrawerOpen={isDrawerOpen}
              setisDrawerOpen={setisDrawerOpen}
              Quota={Quota && Quota}
              selection={selected}
              setselection={setselected}
              toggled={toggle}
              settoggled={settoggle}
              uname={MailStats?.user}
              userslist={userslist}
              userHome={userHome}
              setModalOpen={setModalOpen}
              searchText={searchText}
              search={search}
              setsearchText={setsearchText}
            />
          )}
          <div className="flex flex-1 flex-row overflow-hidden  ">
            <div className="w-full scroll-smooth   scrollbar-thin  scrollbar-thumb-primary scrollbar-track-windowBarBackground  scrollbar-thumb-rounded-full scrollbar-track-rounded-full justify-center items-center overflow-y-scroll">
              {Component?.Render && (
                <Component.Render params={Component?.params} />
              )}
            </div>
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
                  setisAnyMailOpen={setisAnyMailOpen}
                  maillist={Data}
                  pathContents={
                    MailStats
                      ? MailStats
                      : JSON.parse(
                        readFile(path.join(userHome, "conf", "conf.txt"))
                      )
                  }
                  userHome={userHome}
                  user={user}
                />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
