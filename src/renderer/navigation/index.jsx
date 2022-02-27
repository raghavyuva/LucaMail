import React, { useEffect } from "react";
import { checkExists, createFolder, readFile } from "~/lib/fileAction";
import { connect, useDispatch } from "react-redux";
import { setAuthenticated } from "~/redux/actions/UserActions";
import Login from "~/pages/Login";
import WindowBar from "~/components/TopBar/WindowBar";
import { HashRouter, Route, Routes } from "react-router-dom";
import { getInformation } from "~/services/flow";
import Folder from "~/pages/Folder";
import Settings from "~/pages/Settings";
import NotFound from "./NotFound";
// import Layout from "../pages/Layout";
import { setUser } from "../redux/actions/UserActions";
import Inbox from "../pages/Inbox";
const { ImapFlow } = require("imapflow");
const path = require("path");

function Index({ Authenticated }) {
  const dispatch = useDispatch();

  let data = JSON.parse(readFile(path.join("user", "user.txt")))
    ? JSON.parse(readFile(path.join("user", "user.txt")))
    : null;

  useEffect(() => {
    let isMounted = true;
    if (data?.auth?.user && data?.auth?.pass) {
      dispatch(setAuthenticated(true));
      dispatch(setUser(data));
      if (!checkExists("conf" || !checkExists("mail"))) {
        createFolder("conf");
        createFolder("mail");
      }
    } else {
      dispatch(setAuthenticated(false));
    }
    return () => {
      isMounted = false;
    };
  }, [data]);

  return (
    <div>
      {Authenticated ? (
        <HashRouter>
          <Routes>
            <Route index path="/" exact element={<Inbox />} />
            <Route
              index
              path="/folder/:folderName"
              exact
              element={<Folder />}
            />
            <Route index path="/settings" exact element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      ) : (
        <>
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
