import React from "react";
import TitleBar from "~/components/TopBar/WindowBar";
import { useTranslation } from 'react-i18next';

function Loading({ icon }) {
  const { t } = useTranslation()
  return (
    <div className="bg-LoadingBackground  text-LoadingText">
      <>
        <TitleBar icon={icon} />
        <div className="flex flex-col justify-center items-center      h-[calc(100vh_-_2rem)]">
          <div className="flex flex-col items-center ">
            <h1 className="text-3xl font-bold capitalize  leading-loose mr-4  ">
              {t("loadingtag")}
            </h1>
            <img
              src="https://camo.githubusercontent.com/09b4eefc1e15caef9a2e732fba9d4a5c4baf1a57c8a1ea21bcb3b639a3c5457d/68747470733a2f2f696d6775722e636f6d2f74637258454b4b2e706e67"
              className="w-32 h-32 mt-10 animate-bounce"
            />
          </div>
        </div>
      </>
    </div>
  );
}

export default Loading;
