import { HiOutlineStar, HiStar } from "react-icons/hi";
import React, { useState } from "react";
import { MdOutlineMarkChatRead, MdOutlineMarkChatUnread } from "react-icons/md";
const ListBigCard = ({
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
}) => {
  const [localStar, setlocalStar] = useState(isstarred);
  const [localread, setlocalread] = useState(read);
  return (
    <div
      ref={ref}
      className={`${localread
          ? "bg-MailCardBackground  opacity-90"
          : "bg-MailCardBackground opacity-100"
        } rounded-sm  mr-4  flex flex-col   overflow-clip
        shadow-md hover:shadow-lg lg:max-w-full md:max-w-md sm:max-w-sm cursor-pointer  p-4 m-2  flex-wrap`}
    >
      <div
        className="flex lg:flex-row flex-col justify-between  "
        onClick={() => {
          setisAnyMailOpen(true);
          setopenedmail(mailObject);
          setlocalread(true);
          setcomposeopen(false);
        }}
      >
        <div className="flex-row flex justify-start items-center ">
          <div className="h-10 w-10 bg-MailCardUserIconBackground  text-text   rounded-full  mr-1 shadow-2xl items-center justify-center flex ">
            <span className="uppercase font-extrabold text-MailCardUserIconText">
              {subject[0] ? subject[0] : username[0]}
            </span>
          </div>
          <div className="flex flex-col max-w-sm">
            <span className="text-MailCardSenderText font-mono  font-semibold">
              {subject}
            </span>
          </div>
        </div>
        <div className="flex flex-col ">
          <span className="text-MailCardTime ">{time ? time : ""}</span>
        </div>
      </div>
      <div>
        <div className="p-2 flex justify-between max-w-xs  ">
          <span className="text-MailCardSenderText text-sm capitalize  ">
            {username ? username : ""}
          </span>
          {!localread ? (
            <div
              onClick={() => {
                setlocalread(!localread);
                CheckForSelectedDiv(messageId, "seen");
              }}
              className=" px-1 py-1 rounded-br-xl rounded-tl-xl shadow-xl   self-end"
            >
              <MdOutlineMarkChatRead
                size={18}
                className="text-MailCardUnreadIcon"
              />
            </div>
          ) : (
            <MdOutlineMarkChatUnread
              size={18}
              className="text-MailCardUnreadIcon"
              onClick={() => {
                setlocalread(!localread);
                CheckForSelectedDiv(messageId, "unread");
              }}
            />
          )}
        </div>
        <div className="flex flex-row justify-between p-2"
          onClick={() => {
            setisAnyMailOpen(true);
            setopenedmail(mailObject);
            setlocalread(true);
            setcomposeopen(false);
          }}
        >
          <span className="text-MailCardMessageTruncated cursor-pointer ">
            {body ? body : ""}
          </span>
          <div>
            <span className="text-MailCardStarredIcon ">
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
};

export default ListBigCard;
