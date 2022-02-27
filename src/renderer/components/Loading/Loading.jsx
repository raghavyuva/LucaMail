import React from "react";
import TitleBar from "~/components/TopBar/WindowBar";

function Loading({ icon }) {
  return (
    <div className="">
      <>
        <TitleBar icon={icon} />
        <div className="flex flex-col justify-center items-center      h-[calc(100vh_-_2rem)]">
          <div className="flex items-center">
            <span className="text-3xl font-bold capitalize font-mono leading-loose mr-4">
              hang on while we are fetching mail for you
            </span>
            <div
              style={{ borderTopColor: "transparent" }}
              className="w-8 h-8  border-4 border-blue-400 border-solid rounded-full animate-spin"
            ></div>
          </div>
        </div>
      </>
    </div>
  );
}

export default Loading;
