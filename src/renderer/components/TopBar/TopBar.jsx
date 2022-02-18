import React, { useState, useEffect } from "react";
import { HiSearch } from "react-icons/hi";
import { MdOutlineFilterList } from "react-icons/md";
import { applyTheme } from "../../themes/themeutil";
import ThemeSelect from "./ThemeSelect";
import useComponentVisible from "~/utils/TouchBehaviour";

function TopBar({
  Quota,
  searchText,
  setsearchText,
  search,
  selection,
  setselection,
  toggled,
  settoggled,
  uname,
  isDrawerOpen,
}) {
  const [isExpanded, setisExpanded] = useState(false);
  const [selected, setselected] = useState("creamRose");
  const [toggle, settoggle] = useState(false);
  const { ref } = useComponentVisible(false, toggle, settoggle);

  useEffect(() => {
    setselected(selected);
    applyTheme(selected);
  }, [selected]);

  const capacity = (
    (Quota?.storage?.limit - Quota?.storage?.usage) /
    1073741824
  )
    .toString()
    .slice(0, 4);

  return (
    <div className=" sticky  top-0 z-0 hidden md:flex  ">
      <nav
        className={`bg-secondary ${
          isDrawerOpen && "w-[calc(100vw_-_2rem)]"
        } w-screen  shadow-lg`}
      >
        <div className="">
          <div className="flex items-center md:justify-between h-14">
            <div className="flex flex-row items-center">
              <div className="flex  items-center ml-10 bg-positive rounded-md  p-1   focus-within:shadow-lg ">
                <MdOutlineFilterList
                  size={30}
                  className="mr-2  cursor-pointer "
                  onClick={() => settoggled(!toggled)}
                />

                <input
                  type="text"
                  className=" text-primary-text  outline-none bg-positive"
                  placeholder="Search All Mails"
                  onFocus={() => setisExpanded(!isExpanded)}
                  value={searchText}
                  onChange={(e) => setsearchText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      search();
                    }
                  }}
                />
                <HiSearch
                  className="text-primary-text mx-2"
                  size={20}
                  onClick={search}
                />
              </div>
            </div>
            <div className="md:flex  items-center hidden  ">
              {Quota?.storage?.status && (
                <div className="lg:flex hidden ">
                  <span className="text-primary-text font-mono mr-2">
                    Disk Used: {Quota?.storage?.status} ,
                  </span>
                  <span className="text-primary-text font-mono mr-2">
                    Disk Available : {capacity} gb
                  </span>
                </div>
              )}

              <div ref={ref} className="m-2 flex items-center mr-4  ">
                <div className="flex flex-col items-center ">
                  <ThemeSelect
                    selected={selected}
                    setselected={setselected}
                    toggle={toggle}
                    settoggle={settoggle}
                  />
                </div>
              </div>
              <div className="flex items-center justify-evenly m-2">
                <span className=" font-semibold  leading-loose">{uname}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default TopBar;
