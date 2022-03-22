import React, { useState, useEffect } from "react";
import { sidebarBottomContents } from "./constant";
import { useLocation } from "react-router-dom";
import SideElementsComp from "./SideElementsComp";
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
import { useDispatch } from "react-redux";
import {
  setActiveSideBar,
  setFolderStrucure,
} from "../../redux/actions/appActions";
const path = require("path");
function SideBar({
  composeopen,
  setcomposeopen,
  setactionFromReply,
  isAnyMailOpen,
  folderStructure,
  userHome,
  user
}) {
  const [active, setactive] = useState(0);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;
    if (!folderStructure) {
      dispatch(
        setFolderStrucure(
          JSON.parse(readFile(path.join(userHome, "conf", "conf.txt")))
            ?.folderTree
            ? JSON.parse(readFile(path.join(userHome, "conf", "conf.txt")))
                ?.folderTree
            : 0
        )
      );
    }
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let x = location.pathname.substring(location.pathname.lastIndexOf(":") + 1);
    let y = x.split("%");
    if (y[0] == "/") {
      y[0] = folderStructure ? folderStructure[0]?.path : y[0];
    }
    dispatch(setActiveSideBar(y[0]));
    folderStructure?.length > 0 &&
      folderStructure?.map((content, index) => {
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




  return (
    <div className=" flex flex-col shadow-lg justify-between h-[calc(100vh_-_2rem)] ml-2">
      <div className="flex flex-col justify-center ">
          <ComposeBtn
            setactionFromReply={setactionFromReply}
            composeopen={composeopen}
            setcomposeopen={setcomposeopen}
          />
        <div className=" flex flex-col mt-2   ">
          {folderStructure?.length &&
            folderStructure?.map((content, index) => (
              <>
                {!content?.folders && (
                  <SideElementsComp
                    label={content?.folders ? "" : content?.name}
                    key={content?.path?.toString()}
                    index={index}
                    Icon={ChooseIcons(content?.name)}
                    active={active}
                    link={content.path}
                    bottom={false}
                    userHome={userHome}
                    user={user}
                  />
                )}
                {content?.folders?.map((folder, i) => (
                  <SideElementsComp
                    label={folder.name}
                    key={folder?.path?.toString()}
                    index={folder?.path?.toString()}
                    Icon={ChooseIcons(folder?.name)}
                    active={active}
                    link={folder.path}
                    bottom={false}
                    userHome={userHome}
                    user={user}
                  />
                ))}
              </>
            ))}
        </div>
      </div>
      <div className=" flex flex-col">
        {sidebarBottomContents &&
          sidebarBottomContents.map((content, index) => (
            <SideElementsComp
              label={content.label}
              key={content?.id}
              index={index}
              Icon={content.icon}
              link={content.link}
              bottom={true}
              userHome={userHome}
              user={user}
            />
          ))}
      </div>
    </div>
  );
}

export default SideBar;

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
