import React from "react";
import TitleBar from "~/components/TopBar/WindowBar";

function Loading({ count }) {
  return (
    <div className="">
      <>
        <TitleBar />
        <div className="flex justify-center items-center  bg-gradient-to-tr from-positive via-primary-background to-primary    h-[calc(100vh_-_2rem)]">
          <div
            style={{ borderTopColor: "transparent" }}
            className="w-16 h-16  border-4 border-blue-400 border-solid rounded-full animate-spin"
          ></div> 
        </div>
      </>
    </div>
  );
}

export default Loading;
