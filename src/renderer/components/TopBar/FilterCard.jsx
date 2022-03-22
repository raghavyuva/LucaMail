import React from "react";
import { MdOutlineCheck, MdOutlineClose } from "react-icons/md";
import { FilterItems } from "./constant";

function FilterCard({
  selected,
  setselected,
  toggle,
  settoggle,
  onFilterSelection,
}) {
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
        <div className="inline-block align-bottom bg-MailCardBackground p-2 rounded-lg  text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="flex flex-row justify-between">
            <span className="text-xl text-text font-mono font-bold">Filter Messages</span>
            <span>
              <MdOutlineClose
                size={30}
                className="text-primary"
                onClick={() => {
                  setselected("");
                  settoggle(!toggle);
                }}
              />
            </span>
          </div>
          <div className=" px-4 py-3 sm:px-6 grid grid-cols-2 space-y-2 ">
            {FilterItems &&
              FilterItems.map((item) => {
                return (
                  <div
                    className="bg-background p-2 shadow-lg  rounded-md  mx-2 items-center flex justify-center   "
                    onClick={() => {
                      onFilterSelection(item.label);
                    }}
                  >
                    <span className="text-text font-semibold">
                      {item.label}
                    </span>
                    {item.label == selected && (
                      <MdOutlineCheck size={20} className="text-primary" />
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterCard;
