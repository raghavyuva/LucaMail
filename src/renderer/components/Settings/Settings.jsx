import React, { useState } from "react";
import { SettingTypes } from "~/static/constants/Settings";
import Button from "../Basic/Button";
import GeneralSettings from "./GeneralSettings";
import ThemeSettings from "./ThemeSettings";
const fs = require("fs");

function Settings({ params }) {
  const { user } = params;
  let localval = JSON.parse(localStorage.getItem("Settings"));
  const [Checked, setChecked] = useState(
    localval ? localval : SettingTypes["boolvaled"]
  );
  const [activelabel, setactivelabel] = useState(
    SettingTypes["TabHeaders"][0].label
  );
  const [CustomThemeFile, setCustomThemeFile] = useState();
  function OnApplyChanges() {
    localStorage.setItem("Settings", JSON.stringify(Checked));
    if (Checked[2].default == false) {
    }
    alert("changes applied");
  }

  return (
    <section className="w-full bg-background text-text  px-4">
      <nav className="p-4 flex text-sm font-medium  max-w-fit">
        {SettingTypes?.TabHeaders?.map((e) => (
          <button
            onClick={() => setactivelabel(e.label)}
            className={` p-4 -mb-px border-b border-b-SideBarBackground ${
              activelabel == e.label && "border-b-primary"
            } `}
            title={e.label}
          >
            <div class="flex items-center justify-center">{e.label}</div>
          </button>
        ))}
      </nav>
      <div className="flex flex-col ">
        <div className="w-full mt-4 mx-auto bg-white shadow-2xl rounded-sm  ">
          <div className="p-3">
            <div className="overflow-x-auto max-w-screen-xl">
              {activelabel == "General Settings" && (
                <>
                  {Checked.map((e, index) => (
                    <GeneralSettings
                      id={e.label}
                      name={e.label}
                      value={e.defaultval}
                      checked={e.defaultval}
                      onChange={(x) => {
                        let items = [...Checked];
                        let item = { ...Checked[index] };
                        item.defaultval = x.target.checked;
                        items[index] = item;
                        setChecked(items);
                      }}
                      Data={e}
                    />
                  ))}
                  <Button handler={OnApplyChanges} btntext="save changes" />
                </>
              )}
              {activelabel == "Theme Configuration" && (
                <>
                  <ThemeSettings
                    CustomThemeFile={CustomThemeFile}
                    setCustomThemeFile={setCustomThemeFile}
                    user={user}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Settings;
