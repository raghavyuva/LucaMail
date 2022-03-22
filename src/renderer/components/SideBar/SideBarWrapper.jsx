import React, { useState } from "react";
import SideBar from "./SideBar";

function SideBarWrapper({
  folderStructure,
  isDrawerOpen,
  setisDrawerOpen,
  composeopen,
  setcomposeopen,
  actionFromReply,
  setactionFromReply,
  isAnyMailOpen,
  showSupportCard,
  userHome,
  user
}) {
  return (
    <div className="bg-SideBarBackground    md:w-36  w-0 h-screen">
      <div className="md:flex flex-col   hidden h-full">
        <ul className="">
          <SideBar
            isDrawerOpen={isDrawerOpen}
            composeopen={composeopen}
            setcomposeopen={setcomposeopen}
            setisDrawerOpen={setisDrawerOpen}
            folderStructure={folderStructure}
            actionFromReply={actionFromReply}
            setactionFromReply={setactionFromReply}
            isAnyMailOpen={isAnyMailOpen}
            showSupportCard={showSupportCard}
            userHome={userHome}
            user={user}
          />
        </ul>
      </div>
    </div>
  );
}

export default SideBarWrapper;
