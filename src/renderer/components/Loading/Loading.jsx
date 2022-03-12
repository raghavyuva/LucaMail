import React from "react";
import TitleBar from "~/components/TopBar/WindowBar";
import Icon from '../../../main/helpers/lucamail.png'
import './loading.css'
function Loading({ icon }) {
  return (
    <div className="bg-LoadingBackground  text-LoadingText">
      <>
        <TitleBar icon={icon} />
        <div className="flex flex-col justify-center items-center      h-[calc(100vh_-_2rem)]">
          <div className="flex items-center typewriter">
            <h1 className="text-3xl font-bold capitalize  leading-loose mr-4  ">
              hang on while luca is bringing mail for you
            </h1>
            <div aria-label="Loading..." role="status">
             <img src={Icon}  className="w-32 h-32 animate-bounce"  />
            </div>
          </div>
        </div>
      </>
    </div>
  );
}

export default Loading;
