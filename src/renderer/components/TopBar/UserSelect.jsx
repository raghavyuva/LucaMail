import React, { useState, useEffect } from "react";
import { MdAdd, MdArrowDropDown, MdCheck } from "react-icons/md";
import { useTranslation } from 'react-i18next';

function UserSelect({ selected, toggle, settoggle, Data, onClickHandler, setModalOpen }) {
  const [changedval, setchangedval] = useState(selected);
  const { t } = useTranslation();


  useEffect(() => {
    setchangedval(selected);
  }, [selected]);

  return (
    <div className="relative inline-block text-left">
      <div>
      
        <button
          onClick={() => settoggle(!toggle)}
          type="button"
          className="inline-flex justify-center w-full  text-BannerCardButtonText bg-BannerCardButtonBackground rounded-tl-2xl rounded-br-2xl  shadow-lg px-4 py-2  text-sm   font-bold "
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
        >
          {selected}
          <MdArrowDropDown className="-mr-1 ml-2 h-5 w-5" />
        </button>
      </div>
      {toggle && (
        <div
          className="origin-top-right absolute right-0 mt-2  px-5   text-text rounded-md shadow-lg bg-MailCardBackground ring-opacity-5  "
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabindex="-1"
        >
          <div className="flex py-2  items-center">
            <button
              onClick={() => {
                setModalOpen(true);
              }}
              className="inline-block  text-text bg-primary mr-2  rounded-full hover:bg-background hover:text-indigo-600 active:text-indigo-500 focus:outline-none focus:ring"
            >
              <span className="sr-only"> {t("AddUser")} </span>
              <MdAdd size={20} />
            </button>
            <span>{t("AddNewUser")}</span>
          </div>
          {Data.map((val) => {
            return (
              <div
                className="flex p-2 shadow-lg rounded-md items-center cursor-pointer my-2 "
                role="none"
              >
                {changedval != val?.auth?.user ? (
                  <div className=" p-1 h-2 w-2  rounded-full" />
                ) : (
                  <MdCheck size={18} />
                )}
                <div
                  onClick={() => onClickHandler(val)}
                  className="text-text  block px-4 py-2 text-sm no-underline p-2"
                >
                  {val?.auth?.user}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default UserSelect;

