import React from "react";
import {
  MdGridView,
  MdRefresh,
  MdViewCompact,
  MdViewList,
} from "react-icons/md";
import PaginationComp from "./PaginationComp";

function ListTopIcons({
  Refresh,
  TotalCount,
  FetchLimit,
  FetchUptoNextLimit,
  Data,
  GridView,
  setGridView,
}) {
  return (
    <div className="flex flex-col text-text ">
      <div className="  flex  mt-4 items-center justify-evenly">
        <div className="flex flex-row">
          <MdRefresh
            size={30}
            className="mr-2 cursor-pointer "
            onClick={Refresh}
          />
          {GridView == 2 && (
            <MdViewList
              className="mr-2 cursor-pointer "
              size={30}
              onClick={() => setGridView(0)}
            />
          )}
          {GridView == 0 && (
            <MdGridView
              className="mr-2 cursor-pointer "
              size={30}
              onClick={() => setGridView(1)}
            />
          )}
          {GridView == 1 && (
            <MdViewCompact
              className="mr-2 cursor-pointer "
              size={30}
              onClick={() => setGridView(2)}
            />
          )}
        </div>
        <span className="font-mono font-semibold  mr-4">
          {Data?.length} Fetched Messages
        </span>
        <div className="hidden lg:flex">
          <PaginationComp
            TotalCount={TotalCount}
            FetchLimit={FetchLimit}
            FetchUptoNextLimit={FetchUptoNextLimit}
          />
        </div>
      </div>
    </div>
  );
}

export default ListTopIcons;
