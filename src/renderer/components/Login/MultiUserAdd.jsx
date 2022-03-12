import React from "react";
import { MdOutlineClose } from "react-icons/md";
import Login from "../../pages/Login";

function MultiUserAdd({ setModalOpen }) {
  return (
    <div
      className="fixed z-50 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4  text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-MailCardBackground p-2 rounded-lg w-full text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="flex flex-row justify-between">
            <span>
              <MdOutlineClose
                size={30}
                className="text-primary"
                onClick={() => {
                  setModalOpen(false);
                }}
              />
            </span>
          </div>
          <div className="bg-secondary  ">
            <Login frommultiuser={true} 
            
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MultiUserAdd;

