import React from "react";
import { Supporting } from "./constant";

function SupportCard() {
  return (
    <div>
      <aside className="flex  bg-SupportCardBackground  text-text  shadow-lg  py-2 px-2  mr-2 rounded-sm  justify-center items-center flex-col ">
        <h3 className="text-xl font-bold text-SupportCardText">
          {Supporting.title}
        </h3>

        <p className=" text-sm text-SupportCardText ">{Supporting.tagline}</p>
        <a
          href="https://ko-fi.com/raghavyuva"
          className=" items-center  p-1   bg-SupportCardButtonBackground rounded-tl-2xl rounded-br-2xl  no-underline text-sm font-medium text-SupportCardButtonText shadow-md rounded-lg  hover:bg-primary"
        >
          {Supporting.btn}
        </a>
      </aside>
    </div>
  );
}

export default SupportCard;
