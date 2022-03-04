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
}) {
  return (
    <div className="bg-positive    md:w-32  w-0 h-screen">
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
          />
        </ul>
      </div>
    </div>
  );
}

export default SideBarWrapper;
