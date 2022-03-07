import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setAuthenticated } from "~/redux/actions/UserActions";
import { setActiveSideBar } from "../../redux/actions/appActions";
import { setAllMail, setEnvelope } from "../../redux/actions/MailList";
const os = require("os");
const homedir = os.homedir();
var fs = require("fs");
const path = require("path");
let appPath = "luca";
function SideElementsComp({ index, label, Icon, active, link, bottom ,userHome}) {
  const [visible] = useState(false);
  const dispatch = useDispatch();

  return (
    <Link
      to={{
        pathname: !bottom
          ? label?.toLowerCase().includes("inbox")
            ? "/"
            : `/folder/:${label}`
          : label?.toLowerCase().includes("settings")
          ? "/settings"
          : "/",
        state: link,
      }}
      state={link}
      onClick={() => {
        if (label.toLowerCase().includes("logout")) {
          try {
            fs.rmSync(path.join(homedir, appPath,userHome), {
              recursive: true,
              force: true,
            });
            dispatch(setEnvelope([]));
            dispatch(setAllMail([]));
            dispatch(setAuthenticated(false));
          } catch (error) {
            alert("error logging out");
          }
        } else {
          dispatch(setActiveSideBar(label));
        }
      }}
      className={`${
        active === label ? "" : "opacity-100 "
      }  my-3     cursor-pointer opacity-90    no-underline  `}
    >
      <div className="flex justify-between flex-row items-center ">
        <div
          className={`z-50 rounded-md  items-center flex flex-row p-1   justify-self-start transform  duration-300 ease-in-out ${
            visible && " "
          }`}
        >
          {Icon && (
            <Icon
              className={` ${
                active == label
                  ? "bg-SideBarIconActiveBackground text-SideBarIconText"
                  : " bg-SideBarIconInActiveBackground  text-text"
              } p-2 rounded-lg shadow-lg  `}
              size={30}
            />
          )}

          <div>
            <span className="text-text capitalize    font-semibold pl-2  no-underline ">
              {label}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default SideElementsComp;
