import React from "react";

const GeneralSettings = ({ Data, id, name, value, checked, onChange }) => {
  const { label, description, } = Data;
  return (
    <div>
      <div className="flex justify-between pt-4 pb-2 border-b border-b-SideBarBackground">
        <div className="flex flex-col">
          <span className="text-md ">{label}</span>
          <span className="text-xs opacity-75">{description}</span>
        </div>
        <input
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={(e) => onChange(e)}
          type="checkbox"
          className=" h-4 w-4  rounded"
        />
      </div>
    </div>
  );
};

export default GeneralSettings;
