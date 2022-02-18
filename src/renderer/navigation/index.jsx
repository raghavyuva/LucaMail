import React, { useEffect } from "react";
import { checkExists, createFolder, readFile } from "~/lib/fileAction";
import { connect, useDispatch } from "react-redux";
import { setAuthenticated } from "~/redux/actions/UserActions";
import Login from "~/pages/Login";
import WindowBar from "~/components/TopBar/WindowBar";
import Loading from "~/components/Loading/Loading";
import { HashRouter, Route, Routes } from "react-router-dom";
import Inbox from "~/pages/Inbox";
import { getInformation } from "~/services/flow";
import Folder from "~/pages/Folder";
import Settings from "~/pages/Settings";
import NotFound from "./NotFound";
const { ImapFlow } = require("imapflow");
const path = require("path");
function Index({ loading, Authenticated, default_theme }) {
  const dispatch = useDispatch();

  let data = JSON.parse(readFile(path.join("user", "user.txt")))
    ? JSON.parse(readFile(path.join("user", "user.txt")))
    : null;

  useEffect(() => {
    let isMounted = true;
    if (data?.auth?.user && data?.auth?.pass) {
      dispatch(setAuthenticated(true));
      let client = new ImapFlow(data);
      if (!checkExists("conf")) {
        createFolder("conf");
        getInformation(client, "INBOX", "conf.txt");
      }
    } else {
      dispatch(setAuthenticated(false));
    }
    return () => {
      isMounted = false;
    };
  }, [data]);

  if (loading) {
    return <Loading />;
  }
  return (
    <div>
      {Authenticated ? (
        <HashRouter>
          <Routes>
            <Route
              index
              path="/"
              exact
              element={<Inbox clientconfig={data} />}
            />
            <Route
              index
              path="/folder/:folderName"
              exact
              element={<Folder />}
            />
            <Route index path="/settings" exact element={<Settings />} />
            <Route path="*" element={<NotFound/>} />
          </Routes>
        </HashRouter>
      ) : (
        <>
          <WindowBar icon={false} />
          <Login />
        </>
      )}
    </div>
  );
}
const mapStateToProps = (state) => ({
  Token: state.userDetails.token,
  loading: state.loadingDetails.loading,
  default_theme: state.themeDetails.theme,
  Authenticated: state.userDetails.Authenticated,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
