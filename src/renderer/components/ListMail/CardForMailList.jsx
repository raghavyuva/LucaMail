import React, { useState } from "react";
import { MdStar } from "react-icons/md";
function CardForMailList({ Data, setisAnyMailOpen, setopenedmail }) {
  const { sender, from, date, replyTo, subject } = Data;
  let today = new Date();

  function istoDay() {
    let converted = new Date(date);
    let val;
    if (converted?.toDateString() === today?.toDateString()) {
      val = converted?.toTimeString();
    } else {
      val = converted?.toDateString();
    }
    return val.slice(0, 8);
  }

  return (
    <div>
      <div
        className={
          "relative block px-3  hover:scale-100 bg-MailCardBackground  transition-shadow bg-white  shadow-xl group hover:shadow-lg overflow-hidden  m-2  rounded-lg"
        }
        onClick={() => {
          setisAnyMailOpen(true);
          setopenedmail(Data);
          // setlocalread(true);
          // setcomposeopen(false);
        }}
      >
        <div className="justify-between sm:flex">
          <div className="flex ">
            <div className="flex-shrink-0 hidden  sm:block">
              <div className="h-6 w-6 rounded-full bg-MailCardUserIconBackground text-MailCardUserIconText  mr-1 items-center justify-center flex shadow-lg">
                <span className="uppercase font-extrabold">
                  {sender && sender[0]?.name
                    ? sender[0].name[0]
                    : sender[0]?.address[0]}
                </span>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-bold ">
                {sender && sender[0]?.name
                  ? sender[0].name
                  : sender[0]?.address}
              </h5>
              <p className="mt-1 text-xs font-medium text-primary-text">{}</p>
            </div>
          </div>
          <div>{istoDay()}</div>
        </div>
        <div className=" sm:flex  justify-between sm:pr-8">
          <p className="text-sm text-gray-500 truncate">{subject}</p>
          <strong class="inline-flex items-center  text-red-500  uppercase px-5 py-1.5 rounded-full text-[10px] tracking-wide">
            <button
              class=" bg-MailCardReadButtonBackground  text-MailCardReadButtonText hover:opacity-75 transition-opacity rounded-full ml-2.5 -mr-2.5 focus:outline-none focus:ring"
              type="button"
            >
              <span class="sr-only"> star </span>
              <MdStar className="w-3 h-3 text-MailCardStarredIcon" />
            </button>
          </strong>
        </div>
      </div>
    </div>
  );
}

export default CardForMailList;
