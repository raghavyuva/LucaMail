import React from "react";
import { MdOutlineClose, MdMenu, MdArrowBack } from "react-icons/md";
import { VscChromeMaximize, VscChromeMinimize } from "react-icons/vsc";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
const { ipcRenderer } = window.require("electron");
const ipc = ipcRenderer;
const WindowBar = ({ icon, isDrawerOpen, setisDrawerOpen }) => {
  const { t } = useTranslation();
  return (
    <div className=" h-8  top-0 bg-windowBarBackground shadow-sm   flex  justify-between  z-50  ">
      <div className="p-2">
        {icon != "back" ? (
          <>
            {icon == false ? (
              <></>
            ) : (
              <MdMenu
                size={20}
                className="mx-2 text-WindowBarIcon cursor-pointer  "
                onClick={() => {
                  setisDrawerOpen(!isDrawerOpen);
                }}
              />
            )}
          </>
        ) : (
          <>
            <Link to="/">
              <MdArrowBack
                size={20}
                className="mx-2 text-WindowBarIcon cursor-pointer "
              />
            </Link>
          </>
        )}
      </div>
      <div className="flex-1 titlebar ">
        <div className="text-windowBarText self-center text-center p-2 font-mono font-bold  ">
          {t("LucaMail")}
        </div>
      </div>
      <div className="flex flex-row justify-evenly p-2">
        <VscChromeMinimize
          size={20}
          onClick={() => ipc.send("minimizeApp")}
          className="mx-2 text-WindowBarIcon hover:bg-primary  cursor-pointer"
        />
        <VscChromeMaximize
          size={20}
          onClick={() => ipc.send("maximizeApp")}
          className="mx-2 text-WindowBarIcon hover:bg-primary  cursor-pointer"
        />
        <MdOutlineClose
          size={20}
          onClick={() => ipc.send("closeApp")}
          className="mx-2 text-WindowBarIcon hover:bg-primary  cursor-pointer"
        />
      </div>
    </div>
  );
};
export default WindowBar;
