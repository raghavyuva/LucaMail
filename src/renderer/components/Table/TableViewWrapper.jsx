import React, { useState } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import PageLayout from "../../utils/PageLayout";
import TableView from "./TableView";
const csvwriter = require("csv-writer");
const os = require("os");
const homedir = os.homedir();
var fs = require("fs");
const path = require("path");
let appPath = "luca";
export const TableViewWrapper = ({
  user,
  MailStats,
  Envelope,
  maillist,
  folderStructure,
  userslist,
}) => {
  const [isAnyMailOpen, setisAnyMailOpen] = useState(false);
  const [OpenedMail, setOpenedMail] = useState();
  const [searchText, setsearchText] = useState("");
  const [FilteredData, setFilteredData] = useState([]);
  const location = useLocation();
  function SearchFor() {
    let FilteredData = Envelope?.filter(function (item) {
      return item?.subject?.toLowerCase().includes(searchText?.toLowerCase());
    });
    if (FilteredData?.length > 0) {
      setFilteredData(FilteredData);
    }
  }

  function DownloadAsCsv() {
    var createCsvWriter = csvwriter.createObjectCsvWriter
    const csvWriter = createCsvWriter({
      path: path.join(homedir, appPath, user?.auth?.user, "downloads", "ExportedMail.csv"),
      header: [
        { id: 'html', title: 'html' },
        { id: "time", title: "time" },
        { id: "username", title: "username" },
        { id: "subject", title: "subject" },
        { id: "textAsHtml", title: "textAsHtml" },
        { id: "from", title: "from" }
      ]
    })
    const DatatoWrite = maillist?.map((el) => {
      let x = el.body
      return {
        html: x.html,
        time: x.date?.toString(),
        username: x.from.value[0].name,
        subject: x.subject,
        textAsHtml: x.textAsHtml,
        from: x.from.value[0].address,
      }
    })
    csvWriter.writeRecords(DatatoWrite)
      .then((d) => {
        const file = path.join(homedir, appPath, user?.auth?.user, "downloads", "ExportedMail.csv")
      }
      ).finally(
        alert("downloaded successfully check your luca folder")
      )
  }

  return (
    <div className="bg-background w-full">
      <PageLayout
        Component={{
          Render: TableView,
          params: {
            Envelope: FilteredData?.length > 0 ? FilteredData : Envelope,
            message: maillist,
            user: user,
            path: location?.state?.path,
            pathContents: folderStructure,
            onDownloadAsCsv: DownloadAsCsv
          },
        }}
        Data={Envelope}
        message={maillist}
        folderStructure={folderStructure}
        userslist={userslist}
        user={user}
        userHome={user?.auth?.user}
        isAnyMailOpen={isAnyMailOpen}
        openedmail={OpenedMail}
        setisAnyMailOpen={setisAnyMailOpen}
        setopenedmail={setOpenedMail}
        MailStats={MailStats}
        searchText={searchText}
        setsearchText={setsearchText}
        search={SearchFor}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  loading: state.loadingDetails.loading,
  maillist: state.mailDetails.maillist,
  Envelope: state.mailDetails.Envelope,
  currentSideBar: state.appDetails.currentSideBar,
  folderStructure: state.appDetails.folderStructure,
  MailStats: state.appDetails.MailStats,
  user: state.userDetails.user,
  userslist: state.userDetails.userslist,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TableViewWrapper);
