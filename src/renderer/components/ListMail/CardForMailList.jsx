import React, { useState } from "react";
import { HiOutlineStar, HiStar } from "react-icons/hi";
import { MdOutlineMarkChatUnread, MdStar } from "react-icons/md";
function CardForMailList({
  Data,
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
    <div>
      <div
        className={
          "relative block px-3 py-1    bg-MailCardBackground  transition-shadow   shadow-xl group hover:shadow-lg overflow-hidden  m-2  rounded-lg"
        }
      >
        <div className="justify-between sm:flex">
          <div
            className="flex flex-col "
            onClick={() => {
              setisAnyMailOpen(true);
              setopenedmail(mailObject);
              setlocalread(true);
              setcomposeopen(false);
            }}
          >
            <div className="flex">
              <div className="flex-shrink-0 hidden  sm:block">
                <div className="h-6 w-6 rounded-full bg-MailCardUserIconBackground text-MailCardUserIconText  mr-1 items-center justify-center flex shadow-lg">
                  <span className="uppercase font-extrabold">
                    {subject[0] ? subject[0] : username[0]}
                  </span>
                </div>
              </div>
              <div>
                <h5 className="text-sm font-bold ">{subject}</h5>
                <p className="mt-1 text-xs font-medium text-primary-text">
                  {username ? username : ""}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500 truncate">{body}</p>
          </div>
          <div className="flex flex-col items-center">
            <span>{time}</span>
            {!localread ? (
              <div
                onClick={() => {
                  setlocalread(!localread);
                  CheckForSelectedDiv(messageId, "seen");
                }}
              >
                <span className="text-sm text-text">read</span>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardForMailList;
