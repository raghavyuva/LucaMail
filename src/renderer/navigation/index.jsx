import React, { useEffect, useState } from "react";
import { checkExists, createFolder, readFile } from "~/lib/fileAction";
import { connect, useDispatch } from "react-redux";
import { setAuthenticated } from "~/redux/actions/UserActions";
import Login from "~/pages/Login";
import { HashRouter, Route, Routes } from "react-router-dom";
import Folder from "~/pages/Folder";
import NotFound from "./NotFound";
import { setUser, setUsersList } from "../redux/actions/UserActions";
import Inbox from "../pages/Inbox";
import { setTheme } from "../redux/actions/ThemeActions";
import { DEFAULT_THEME } from "../themes";
import { ParseContent } from "../utils/Utils";
import { applyTheme } from "../themes/themeutil";
import TableViewWrapper from "../components/Table/TableViewWrapper";
import SettingsWrapper from "../pages/SettingsWrapper";
import Loading from "../components/Loading/Loading";
const { ImapFlow } = require("imapflow");
const path = require("path");

function Index({ Authenticated,  userslist, user }) {
  const dispatch = useDispatch();
  const [load, setload] = useState(true);

  let data = user;

  async function GetOneUser() {
    let users = JSON.parse(readFile("userslist"));
    if (users?.length > 0 && !user) {
      dispatch(setUsersList(users));
      let firstuser = users[0]?.auth?.user;
      return JSON.parse(readFile(path.join(firstuser, "user.txt")))
        ? JSON.parse(readFile(path.join(firstuser, "user.txt")))
        : null;
    } else {
      if (userslist?.length > 0 && user) {
        return JSON.parse(readFile(path.join(user?.auth?.user, "user.txt")))
          ? JSON.parse(readFile(path.join(user?.auth?.user, "user.txt")))
          : null;
      }
    }
  }

  async function CheckPreferredTheme(data) {
    try {
      let themeObject = await ParseContent(
        path.join(data?.auth?.user, "conf", "theme")
      );
      if (themeObject) {
        applyTheme(themeObject?.preferred, data?.auth?.user);
        dispatch(setTheme(themeObject?.preferred));
        setload(false);
      } else {
        let localpreferred = JSON.parse(localStorage.getItem("preferredtheme"))
          ? JSON.parse(localStorage.getItem("preferredtheme")) : null;
        if (localpreferred) {
          applyTheme(localpreferred, data?.auth?.user);
        } else {
          applyTheme(DEFAULT_THEME?.PaletteName, data?.auth?.user);
        }
        setload(false);
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function UserDispacth() {
    setload(true);
    data = await GetOneUser();
    if (data?.auth?.user && (data?.auth?.pass || data?.auth?.accessToken)) {
      dispatch(setAuthenticated(true));
      dispatch(setUser(data));
      CheckPreferredTheme(data);
      if (
        !checkExists(path.join(data?.auth?.user, "conf")) ||
        !checkExists(path.join(data?.auth?.user, "mail"))
      ) {
        createFolder(path.join(data?.auth?.user, "conf"));
        createFolder(path.join(data?.auth?.user, "mail"));
      }
    } else {
      setload(false);
      dispatch(setAuthenticated(false));
    }
  }

  useEffect(() => {
    let isMounted = true;
    UserDispacth();
    return () => {
      isMounted = false;
    };
  }, []);

  if (load) {
    return (
      <>
        <Loading />
      </>
    );
  }

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
            <Route index path="/settings" exact element={<SettingsWrapper />} />
            <Route
              index
              path="/tableView"
              exact
              element={<TableViewWrapper />}
            />
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
  user: state.userDetails.user,
  userslist: state.userDetails.userslist,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
