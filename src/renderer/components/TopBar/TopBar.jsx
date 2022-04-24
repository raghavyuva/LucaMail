import React, { useState } from "react";
import { HiSearch } from "react-icons/hi";
import { MdOutlineFilterList } from "react-icons/md";
import useComponentVisible from "~/utils/TouchBehaviour";
import UserSelect from "./UserSelect";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/actions/UserActions";
import { setLoading } from "../../redux/actions/LoadingActions";
import { useTranslation } from 'react-i18next';

function TopBar({
  Quota,
  searchText,
  setsearchText,
  search,
  toggled,
  settoggled,
  uname,
  isDrawerOpen,
  userslist,
  userHome,
  setModalOpen,
}) {
  const [isExpanded, setisExpanded] = useState(false);
  const [toggle, settoggle] = useState(false);
  const { ref } = useComponentVisible(false, toggle, settoggle);
  const [selected, setselected] = useState(userHome && userHome);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const capacity = (
    (Quota?.storage?.limit - Quota?.storage?.usage) /
    1073741824
  )
    .toString()
    .slice(0, 4);

  function onClickHandler(val) {
    dispatch(setLoading(true));
    setselected(val?.auth?.user);
    dispatch(setUser(val));
    dispatch(setLoading(false));
  }

  return (
    <div className=" sticky  top-0 z-0 hidden md:flex  ">
      <nav
        className={`bg-SideBarBackground ${isDrawerOpen && "w-[calc(100vw_-_2rem)]"
          } w-screen  shadow-lg`}
      >
        <div className="">
          <div className="flex items-center md:justify-between h-14">
            <div className="flex flex-row items-center">
              <div className="flex  items-center ml-10  rounded-md  p-1  bg-searchBackground shadow-md focus-within:shadow-lg ">
                <MdOutlineFilterList
                  size={30}
                  className="mr-2  text-SearchIcons cursor-pointer "
                  onClick={() => settoggled(!toggled)}
                />

                <input
                  type="text"
                  className=" text-searchText  outline-none bg-searchBackground "
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
                  className="text-SearchIcons mx-2"
                  size={20}
                  onClick={search}
                />
              </div>
            </div>
            <div className="md:flex  items-center hidden  ">
              {Quota?.storage?.status && (
                <div className="lg:flex hidden ">
                  <span className="text-text font-mono mr-2">
                    {t("diskused")}: {Quota?.storage?.status} ,
                  </span>
                  <span className="text-text font-mono mr-2">
                    {t("DiskAvailable")} : {capacity} gb
                  </span>
                </div>
              )}
              <div ref={ref} className="m-2 flex items-center mr-4  ">
                <div className="flex flex-col items-center ">
                  <UserSelect
                    selected={selected}
                    onClickHandler={(val) => onClickHandler(val)}
                    toggle={toggle}
                    settoggle={settoggle}
                    setModalOpen={setModalOpen}
                    Data={userslist?.length > 0 && userslist}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default TopBar;
