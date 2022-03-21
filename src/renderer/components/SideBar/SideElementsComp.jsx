import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setAuthenticated } from "~/redux/actions/UserActions";
import { readFile, WriteFile } from "../../lib/fileAction";
import { setActiveSideBar } from "../../redux/actions/appActions";
import { setAllMail, setEnvelope } from "../../redux/actions/MailList";
import { setUser } from "../../redux/actions/UserActions";
const os = require("os");
const homedir = os.homedir();
var fs = require("fs");
const path = require("path");
let appPath = "luca";
function SideElementsComp({
  index,
  label,
  Icon,
  active,
  link,
  bottom,
  userHome,
  user,
}) {
  const [visible] = useState(false);
  const dispatch = useDispatch();

  async function LogOut() {
    try {
      fs.rmSync(path.join(homedir, appPath, userHome), {
        recursive: true,
        force: true,
      });
      let allusers = JSON.parse(readFile("userslist"));
      let obj = allusers?.find((o, i) => {
        if (o?.auth?.user === user?.auth?.user) {
          delete allusers[i];
          WriteFile("userslist", allusers)
          return true;
        }
      });
      let userslist = JSON.parse(readFile("userslist"));
      if (!userslist) {
        fs.rmSync(path.join(homedir, appPath, "userslist"), {
          recursive: true,
          force: true,
        });
      }
      else if (userslist?.length < 1) {
        dispatch(setAuthenticated(false));
        fs.rmSync(path.join(homedir, appPath, "userslist"), {
          recursive: true,
          force: true,
        });
      } else {
        if (!allusers[0]) {
          fs.rmSync(path.join(homedir, appPath, "userslist"), {
            recursive: true,
            force: true,
          });
          dispatch(setAuthenticated(false));
        } else {
          setUser(allusers[0])
        }
      }
    } catch (error) {
      alert("error logging out",);
      console.log(error)
    }
  }

  return (
    <Link
      to={{
        pathname: !bottom
          ? label?.toLowerCase().includes("inbox")
            ? "/"
            : `/folder/:${label}`
          : link
            ? link
            : "/",
        state: link,
      }}
      state={link}
      onClick={() => {
        if (label.toLowerCase().includes("logout")) {
          LogOut();
        } else {
          dispatch(setActiveSideBar(label));
        }
      }}
      className={`${active === label
        ? "border-l-2 border-l-primary  shadow-2xl border-r-2 border-r-primary"
        : "opacity-100 "
        }  my-3    mr-2 rounded-lg  cursor-pointer opacity-90 group [transform:translateZ(0)]before:bg-sky-600 before:bottom-0 before:left-0 before:h-full before:w-full before:-translate-x-full hover:before:translate-x-0 before:transition before:ease-in-out before:duration-500    no-underline  `}
    >
      <div className="flex justify-between flex-row items-center ">
        <div
          className={`z-50 rounded-md  items-center flex flex-row p-1   justify-self-start transform  duration-300 ease-in-out ${visible && " "
            }`}
        >
          {Icon && (
            <Icon
              className={` ${active == label
                ? "text-text bg-SideBarIconActiveBackground"
                : "  bg-SideBarIconInActiveBackground text-text"
                } p-2 rounded-lg shadow-lg group-hover:bg-MailCardBackground transition ease-in-out duration-500  `}
              size={30}
            />
          )}

          <div>
            <span
              className={`${active == label ? "text-text" : "text-text"
                } capitalize    font-semibold pl-2  no-underline`}
            >
              {label}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default SideElementsComp;
