import React, { useState, useEffect } from "react";
import { sidebarBottomContents } from "./constant";
import { useLocation } from "react-router-dom";
import SideElementsComp from "./SideElementsComp";
import SupportCard from "./SupportCard";
import ComposeBtn from "./ComposeBtn";
import {
  MdInbox,
  MdDrafts,
  MdLabelImportant,
  MdStar,
  MdReport,
  MdFolder,
  MdSend,
} from "react-icons/md";
import { HiTrash } from "react-icons/hi";
import { readFile } from "../../lib/fileAction";
const path = require("path");
function SideBar({
  ExtendedSideBarContents,
  composeopen,
  setcomposeopen,
  setactionFromReply,
  isAnyMailOpen,
  showSupportCard,
}) {
  const [active, setactive] = useState(0);
  const location = useLocation();

  const [SideContent, setSideContent] = useState(
    JSON.parse(readFile(path.join("conf", "conf.txt")))?.folderTree
      ? JSON.parse(readFile(path.join("conf", "conf.txt")))?.folderTree
      : 0
  );

  useEffect(() => {
    if (!SideContent) {
      setSideContent(
        JSON.parse(readFile(path.join("conf", "conf.txt")))?.folderTree
          ? JSON.parse(readFile(path.join("conf", "conf.txt")))?.folderTree
          : 0
      );
    }

    return () => {};
  }, [ExtendedSideBarContents]);

  useEffect(() => {
    let x = location.pathname.substring(location.pathname.lastIndexOf(":") + 1);
    let y = x.split("%");
    if (y[0] == "/") {
      y[0] = SideContent ? SideContent[0]?.path : y[0];
    }
    SideContent.length > 0 &&
      SideContent?.map((content, index) => {
        if (
          content?.path
            ?.substring(content?.path?.lastIndexOf("/") + 1)
            .toLowerCase()
            .includes(y[0]?.toLowerCase())
        ) {
          setactive(content?.path);
        } else {
          content?.folders?.map((folder, i) => {
            if (
              folder?.path
                .substring(folder?.path?.lastIndexOf("/") + 1)
                .toLowerCase()
                .includes(y[0]?.toLowerCase())
            ) {
              setactive(
                folder?.path.substring(folder?.path?.lastIndexOf("/") + 1)
              );
            }
          });
        }
      });
  }, [location]);

  function ChooseIcons(label) {
    let l = label?.toLowerCase();
    switch (l) {
      case "inbox":
        return MdInbox;
      case "starred":
        return MdStar;
      case "drafts":
        return MdDrafts;
      case "important":
        return MdLabelImportant;
      case "junk":
        return MdReport;
      case "spam":
        return MdReport;
      case "trash" || "bin":
        return HiTrash;
      case "sent mail":
        return MdSend;
      default:
        return MdFolder;
    }
  }

  return (
    <div className=" flex flex-col shadow-lg justify-between h-[calc(100vh_-_2rem)] ml-2">
      <div className="flex flex-col justify-center ">
        {isAnyMailOpen && (
          <ComposeBtn
            setactionFromReply={setactionFromReply}
            composeopen={composeopen}
            setcomposeopen={setcomposeopen}
          />
        )}
        <div className=" flex flex-col mt-2   ">
          {SideContent.length &&
            SideContent?.map((content, index) => (
              <>
                {!content?.folders && (
                  <SideElementsComp
                    label={content?.folders ? "" : content?.name}
                    key={index}
                    index={index}
                    Icon={ChooseIcons(content?.name)}
                    active={active}
                    link={content.path}
                    bottom={false}
                  />
                )}
                {content?.folders?.map((folder, i) => (
                  <SideElementsComp
                    label={folder.name}
                    key={i}
                    index={i}
                    Icon={ChooseIcons(folder?.name)}
                    active={active}
                    link={folder.path}
                    bottom={false}
                  />
                ))}
              </>
            ))}
      </div>
      </div>
      <div className=" flex flex-col">
        {!showSupportCard && <SupportCard />}
        {sidebarBottomContents &&
          sidebarBottomContents.map((content, index) => (
            <SideElementsComp
              label={content.label}
              key={index.toString()}
              index={index}
              Icon={content.icon}
              link={content.link}
              bottom={true}
            />
          ))}
      </div>
    </div>
  );
}

export default SideBar;
