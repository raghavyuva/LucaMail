import React, { useState, useEffect } from "react";
import { MdDeleteForever, MdDriveFolderUpload } from "react-icons/md";
import { ListOfThemes } from "../../themes/ColorScheme";
import { ParseContent } from "../../utils/Utils";
import ThemeSelect from "./ThemeSelect";
import useComponentVisible from "~/utils/TouchBehaviour";
import { applyTheme } from "../../themes/themeutil";
import Button from "../Basic/Button";
import { useTranslation } from 'react-i18next';
import { WriteFile, readFile, DeleteFile } from "../../lib/fileAction";
const path = require("path");
const fs = require("fs");

const ThemeSettings = ({ CustomThemeFile, setCustomThemeFile, user }) => {
  const [toggle, settoggle] = useState(false);
  const [selected, setselected] = useState(false);
  const { ref } = useComponentVisible(false, toggle, settoggle);
  const [Data, setData] = useState();
  const [Themes, setThemes] = useState();
  let themepath = path.join(user?.auth?.user, "conf", "theme");
  const { t } = useTranslation()

  async function CheckThemes() {
    let themeObject = await ParseContent(themepath);
    if (themeObject && Object.keys(themeObject?.ListOfThemes)?.length > 0) {
      setData(Object.keys(themeObject?.ListOfThemes));
      setThemes(themeObject);
      setselected(themeObject?.preferred);
    } else {
      let localpreferred = localStorage.getItem("preferredtheme");
      setData(Object.keys(ListOfThemes));
      if (localpreferred) {
        setselected(localpreferred);
      } else {
        setselected(Object.keys(ListOfThemes)[0]);
      }
    }
  }

  function onClickHandler(val) {
    setselected(val);
    applyTheme(val, user?.auth?.user);
  }

  async function WriteCustomTheme() {
    if (!CustomThemeFile) {
      alert("please select file");
    } else {
      let ReadStream;
      try {
        ReadStream = fs.readFileSync(CustomThemeFile?.path, {
          encoding: "utf8",
        });
        if (ReadStream) {
          WriteFile(themepath, JSON.parse(ReadStream));
          applyTheme(JSON.parse(ReadStream)?.preferred, user?.auth?.user);
          alert("changes applied");
          CheckThemes();
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function ApplyThemeConf() {
    if (CustomThemeFile) {
      WriteCustomTheme();
    }
    if (Themes && Object.keys(Themes?.ListOfThemes)?.length > 0) {
      if (selected != Themes?.preferred) {
        let obj = Themes;
        obj.preferred = selected;
        WriteFile(themepath, obj);
        alert("changes applied");
      }
    } else {
      localStorage.setItem("preferredtheme", JSON.stringify(selected));
    }
  }

  async function DeleteCustomTheme() {
    try {
      let deleted = await DeleteFile(themepath);
      if (deleted) {
        CheckThemes();
        setThemes();
      }
    } catch (error) {
      alert("error deleting a file");
      console.log(error);
    }
  }

  useEffect(() => {
    let isMounted = true;
    CheckThemes();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div ref={ref} className="">
      <div className="flex mt-4 justify-between  pb-2 border-b border-b-SideBarBackground">
        <div className="flex flex-col">
          <span className="text-md ">{t("customtheme")}</span>
          <span className="text-xs opacity-75">
            {t("uploadtheme")}
          </span>
        </div>
        <div>
          <div class="flex  items-center justify-center ">
            <label class=" flex  items-center   rounded-lg shadow-lg tracking-wide   cursor-pointer">
              {CustomThemeFile && CustomThemeFile?.name}
              <MdDriveFolderUpload size={30} />
              <input
                type="file"
                class="hidden"
                onChange={(e) => {
                  setCustomThemeFile(e.target.files[0]);
                }}
                accept="application/JSON"
                title="Choose Theme File"
              />
            </label>
          </div>
        </div>
      </div>
      <div className="flex mt-4 justify-between  pb-2 border-b border-b-SideBarBackground">
        <div className="flex flex-col">
          <span className="text-md ">{t("preferredtheme")}</span>
          <span className="text-xs opacity-75">
            {Themes && Object.keys(Themes?.ListOfThemes)?.length > 0
              ? `${t("customselect")}`
              : `${t("defaultselect")}`
            }
          </span>
        </div>
        <div>
          <ThemeSelect
            Data={Data}
            selected={selected}
            settoggle={settoggle}
            toggle={toggle}
            onClickHandler={(val) => onClickHandler(val)}
          />
        </div>
      </div>
      {Themes && Object.keys(Themes?.ListOfThemes)?.length > 0 && (
        <div className="flex mt-4 justify-between  pb-2 border-b border-b-SideBarBackground">
          <div className="flex flex-col">
            <span className="text-md ">{t("deletetheme")}</span>
            <span className="text-xs opacity-75">
              {t("defaultchoose")}
            </span>
          </div>
          <div>
            <MdDeleteForever
              className="hover:text-primary"
              size={30}
              onClick={DeleteCustomTheme}
            />
          </div>
        </div>
      )}
      <Button handler={ApplyThemeConf} btntext={t("applytheme")} />
    </div>
  );
};

export default ThemeSettings;
