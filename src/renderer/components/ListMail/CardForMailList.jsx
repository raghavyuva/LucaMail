import { HiOutlineStar, HiStar } from "react-icons/hi";
import React, { useState } from "react";
import { MdOutlineMarkChatUnread } from "react-icons/md";
function CardForMailList({
  username,
  subject,
  body,
  time,
  isstarred,
  read,
  setisAnyMailOpen,
  setopenedmail,
  messageId,
  mailObject,
  CheckForSelectedDiv,
  ref,
  setcomposeopen,
}) {
  const [localStar, setlocalStar] = useState(isstarred);
  const [localread, setlocalread] = useState(read);
  return (
    <div
      ref={ref}
      className={`${
        localread ? "bg-secondary  opacity-90" : "bg-positive opacity-100"
      } rounded-sm  mr-4  flex flex-col   overflow-clip
                                       bg-gradient-to-br from-positive via-primary-background to-positive shadow-lg lg:max-w-lg  md:max-w-md sm:max-w-sm  p-4 m-2  flex-wrap`}
      onClick={() => {
        setisAnyMailOpen(true);
        setopenedmail(mailObject);
        setlocalread(true);
        setcomposeopen(false);
      }}
    >
      <div className="flex lg:flex-row flex-col justify-between  ">
        <div className="flex-row flex justify-start items-center ">
          <div className="h-10 w-10 bg-gradient-to-tr from-primary via-primary-background to-primary rounded-tr-full pt-2 mr-1 items-center justify-center flex shadow-lg">
            <span className="uppercase font-extrabold">
              {subject[0] ? subject[0] : username[0]}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-primary-text font-mono font-semibold">
              {subject}
            </span>
          </div>
        </div>
        <div className="flex flex-col ">
          <span className="text-primary-text ">{time ? time : ""}</span>
        </div>
      </div>
      <div>
        <div className="p-2 flex justify-between ">
          <span className="text-primary-text text-sm  capitalize text-clip truncate ">
            {username ? username : ""}
          </span>
          {!localread ? (
            <div className="bg-gradient-to-tr from-primary-background via-positive to-primary px-1 py-1 rounded-br-xl rounded-tl-xl shadow-xl   self-end">
              <span className="text-sm">read</span>
            </div>
          ) : (
            <MdOutlineMarkChatUnread
              size={18}
              className="text-primary"
              onClick={() => {
                setlocalread(!localread);
                CheckForSelectedDiv(messageId, "unread");
              }}
            />
          )}
        </div>
        <div className="flex flex-row justify-between p-2">
          <span className="text-primary-text cursor-pointer ">
            {body ? body : ""}
          </span>
          <div>
            <span className="text-primary-text ">
              {localStar == true ? (
                <HiStar
                  size={18}
                  className="text-primary"
                  onClick={() => {
                    setlocalStar(false);
                    CheckForSelectedDiv(messageId, "removestar");
                  }}
                />
              ) : (
                <HiOutlineStar
                  size={18}
                  onClick={() => {
                    setlocalStar(true);
                    CheckForSelectedDiv(messageId, "star");
                  }}
                />
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardForMailList;
