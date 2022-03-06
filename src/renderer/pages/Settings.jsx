import React, { useEffect, useState } from "react";
import TitleBar from "~/components/TopBar/WindowBar";
import { SettingTypes } from "~/static/constants/Settings";
import { readFile, WriteFile } from "../lib/fileAction";
const path = require("path");
const fs = require("fs");

function Settings({}) {
  let localval = JSON.parse(localStorage.getItem("Settings"));
  const [Checked, setChecked] = useState(
    localval ? localval : SettingTypes["boolvaled"]
  );
  const [CustomThemeFile, setCustomThemeFile] = useState();
  function OnApplyChanges() {
    localStorage.setItem("Settings", JSON.stringify(Checked));
    if (Checked[2].default == false) {
    }
    alert("changes applied");
  }

  async function WriteCustomTheme() {
    if (!CustomThemeFile) {
      alert("please select file");
    } else {
      let ReadStream;
      let themepath = path.join("conf", "theme");
      try {
        ReadStream = fs.readFileSync(CustomThemeFile?.path, {
          encoding: "utf8",
        });
        if (ReadStream) {
          WriteFile(themepath, ReadStream);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <div>
      <TitleBar icon="back" />
      <div className="mt-10 sm:mt-0 text-text  bg-opacity-10 w-screen h-[calc(100vh_-_2rem)] bg-[url('https://images.unsplash.com/photo-1491895200222-0fc4a4c35e18?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80')] items-center justify-center flex flex-col">
        <div className="  ">
          <div className=" overflow-hidden sm:rounded-md shadow-2xl  px-20 bg-MailCardBackground">
            <div className="px-4 py-5  space-y-6 sm:p-6">
              <fieldset>
                <legend className="text-base font-medium text-text">
                  General Settings
                </legend>
                {Checked?.map((val, index) => {
                  return (
                    <div className="mt-4 space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id={val.label}
                            name={val.label}
                            value={val.default}
                            checked={val.default}
                            onChange={(e) => {
                              let items = [...Checked];
                              let item = { ...Checked[index] };
                              item.default = e.target.checked;
                              items[index] = item;
                              setChecked(items);
                            }}
                            type="checkbox"
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label className="font-medium text-primary-text">
                            {val.label}
                          </label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </fieldset>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                onClick={OnApplyChanges}
                className="inline-block px-5 py-3 mt-8 text-sm font-medium  bg-BannerCardButtonBackground rounded-tl-2xl rounded-br-2xl text-BannerCardButtonText shadow-lg "
              >
                save changes
              </button>
            </div>
            <div className="flex p-2">
              <input
                type="file"
                onChange={(e) => {
                  setCustomThemeFile(e.target.files[0]);
                }}
              />
              <button
                onClick={WriteCustomTheme}
                className="inline-block px-5 py-3  text-sm font-medium  bg-BannerCardButtonBackground rounded-tl-2xl rounded-br-2xl text-BannerCardButtonText shadow-lg "
              >
                apply theme
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
