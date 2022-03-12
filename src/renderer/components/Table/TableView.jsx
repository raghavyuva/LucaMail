import React, { useState, useEffect } from "react";
import { istoDay } from "../../utils/provider/provider";
import TableData from "./TableData";

const TableView = ({ params }) => {
  const { Envelope, message } = params;
  const [FilteredData, setFilteredData] = useState();
  const [Data, setData] = useState(Envelope);
  let y;
  const [selected, setselected] = useState();
  const [allselected, setallselected] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (FilteredData?.length > 0) {
      setData(FilteredData);
    }
    return () => {
      isMounted = false;
    };
  }, [FilteredData]);

  useEffect(() => {
    setData(Envelope);
    return () => {};
  }, [Envelope]);

  useEffect(() => {
    if (selected && selected?.length > 0) {
      setData(selected);
      setselected();
    }

    return () => {};
  }, [selected]);

  return (
    <section className="w-full bg-gray-100 text-gray-600  px-4">
      <div className="flex flex-col ">
        <div className="w-full mt-4 mx-auto bg-white shadow-2xl rounded-sm  ">
          <div className="p-3">
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="text-xs font-semibold uppercase text-gray-400 bg-windowBarBackground">
                  <tr>
                    <th className="sticky left-0 px-4 py-2 text-left bg-gray-50">
                      <label className="sr-only" for="row_all">
                        Select All
                      </label>
                      <input
                        className="w-3 h-3 border-gray-200 rounded"
                        type="checkbox"
                        id="row_all"
                        value={allselected}
                        onChange={(e) => {
                          if (e.target.checked === true) {
                            Data?.map((el) => {
                              el.checked = true;
                            });
                            setselected(Data);
                          } else {
                            Data?.map((el) => {
                              el.checked = false;
                            });
                            setselected(Data);
                          }
                        }}
                      />
                    </th>
                    <th className="p-2 flex whitespace-nowrap ">
                      <div className="font-semibold text-left">Name</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Email</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Message</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-right">Recieved</div>
                    </th>
                  </tr>
                </thead>
                {Data?.map((data) => {
                  return (
                    <TableData
                      username={data && data?.from[0]?.address}
                      body={data.subject}
                      subject={data && data?.sender[0]?.name}
                      time={istoDay(data)}
                      selected={data.checked ? data?.checked : false}
                      data={data}
                      setData={setData}
                      Data={Data}
                      setallselected={setallselected}
                    />
                  );
                })}
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TableView;
