import React, { useState } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import PageLayout from "../../utils/PageLayout";
import TableView from "./TableView";
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
