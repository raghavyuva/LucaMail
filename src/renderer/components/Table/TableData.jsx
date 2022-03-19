import React from "react";

const TableData = ({
  username,
  body,
  time,
  status,
  subject,
  selected,
  data,
  setData,
  Data,
  setallselected,
}) => {
  function onSelection(e) {
    Array.prototype.insert = function (index, item) {
      this.splice(index, 0, item);
    };
    let index = Data?.indexOf(data);
    let newarr = [];
    let concatarray = newarr.concat(Data);
    let removed = concatarray?.splice(index, 1);
    removed[0].checked = e.target.checked;
    concatarray?.insert(index, removed[0]);
    let findallselected = concatarray?.filter((ele) => {
      return ele.checked == true;
    });
    if (findallselected?.length > 0) {
      setallselected(false);
    }
    setData(concatarray);
  }

  return (
    <tbody class="text-sm text-text  divide-y divide-solid divide-MailCardBackground">
      <tr>
        <td class="sticky left-0 px-4 py-2 ">
          <input
            class="w-3 h-3 border-gray-200 rounded"
            type="checkbox"
            id="row_1"
            checked={selected}
            onChange={onSelection}
          />
        </td>
        <td class="p-2 whitespace-nowrap">
          <div class="flex items-center">
            <div className="h-10 w-10 bg-MailCardUserIconBackground  text-text   rounded-full  mr-1 shadow-2xl items-center justify-center flex ">
              <span className="uppercase font-extrabold text-MailCardUserIconText">
                {subject[0] ? subject[0] : username[0]}
              </span>
            </div>
            <div class="font-medium text-text">{subject}</div>
          </div>
        </td>
        <td class="p-2 whitespace-nowrap">
          <div class="text-left">{username}</div>
        </td>
        <td class="p-2 whitespace-nowrap w-min">
          <div class="text-left truncate text-ellipsis">{body}</div>
        </td>
        <td class="p-2 whitespace-nowrap">
          <div class=" text-right">{time}</div>
        </td>
      </tr>
    </tbody>
  );
};

export default TableData;
