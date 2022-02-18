import React, { useEffect, useState } from "react";
import TitleBar from "~/components/TopBar/WindowBar";
import { SettingTypes } from "~/static/constants/Settings";

function Settings({}) {
  let localval = JSON.parse(localStorage.getItem("Settings"));
  const [Checked, setChecked] = useState(
    localval ? localval : SettingTypes["boolvaled"]
  );

  function OnApplyChanges() {
    localStorage.setItem("Settings", JSON.stringify(Checked));
    if (Checked[2].default == false) {
    }
    alert("changes applied");
  }

  return (
    <div>
      <TitleBar
        icon="back"
      />
      <div className="mt-10 sm:mt-0  bg-opacity-10 w-screen h-[calc(100vh_-_2rem)] bg-[url('https://images.unsplash.com/photo-1491895200222-0fc4a4c35e18?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80')] items-center justify-center flex flex-col">
        <div className="  ">
          <div className=" overflow-hidden sm:rounded-md shadow-2xl  px-20 bg-secondary">
            <div className="px-4 py-5  space-y-6 sm:p-6">
              <fieldset>
                <legend className="text-base font-medium text-primary-text">
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
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                apply changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
