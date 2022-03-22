import React, { useEffect, useState } from "react";
import Structure from "../utils/Structure";
import { FetchMail, OnUpdatedMailFromServer } from "../services";
import { useDispatch, connect } from "react-redux";
import { setAllMail } from "../redux/actions/MailList";
import { checkExists, readFile, WriteFile } from "~/lib/fileAction";
import { getInformation } from "~/services/flow";
import { setEnvelope } from "~/redux/actions/MailList";
import { SettingTypes } from "../static/constants/Settings";
import { setLoading } from "../redux/actions/LoadingActions";
import { setFolderStrucure, setMailStats } from "../redux/actions/appActions";
import { ParseContent } from "../utils/Utils";
import { setUser, setUsersList } from "../redux/actions/UserActions";
import Loading from "../components/Loading/Loading";
import {
  CheckForMailExistense,
  fetchMail,
  GetFetchedCount,
  GetFolderStructureFromServer,
  GetUser,
  GetUserHome,
  inboxpath,
  Parser,
} from "../utils/provider/folderProvider";
import { createFolder } from "../lib/fileAction";
const { ImapFlow } = window.require("imapflow");
const path = require("path");

function Home({
  user,
  currentSideBar,
  loading,
  MailStats,
  Envelope,
  maillist,
  folderStructure,
  userslist,
}) {
  let userHome = user ? user?.auth?.user : GetUserHome();
  let MailPath = currentSideBar?.path ? currentSideBar?.path : "INBOX";
  const [StoreObj, setStoreObj] = useState();
  const [isAnyMailOpen, setisAnyMailOpen] = useState(false);
  const [openedMail, setopenedMail] = useState("");
  const [composeopen, setcomposeopen] = useState(false);
  const [ActionFromreply, setActionFromreply] = useState("newcompose");
  const [SearchText, setSearchText] = useState("");
  const [FilteredData, setFilteredData] = useState([]);
  const [InfoData] = useState(Parser(inboxpath(userHome, "conf")));
  const [ActiveUser, setActiveUser] = useState(user ? user : GetUser());
  let userDefinedFetchLimit = JSON.parse(localStorage.getItem("fetchlimit"))
    ? JSON.parse(localStorage.getItem("fetchlimit"))
    : null;
  const [tLen, settLen] = useState(InfoData?.mailStatus?.messages);
  const [fLimit, setfLimit] = useState(
    tLen
      ? tLen > userDefinedFetchLimit
        ? userDefinedFetchLimit
        : tLen > 50
          ? 50
          : tLen
      : 10
  );
  const [fetchedCount, setfetchedCount] = useState(
    GetFetchedCount(path.join(userHome, "mail", "mail"))
  );
  const dispatch = useDispatch();
  let SettingFromStorage = JSON.parse(localStorage.getItem("Settings"));
  const [store] = useState(
    SettingFromStorage
      ? SettingFromStorage[2].defaultval
      : SettingTypes["boolvaled"][2].defaultval
  );

  let client, updatedClient, infoclient;


  useEffect(() => {
    let isMounted = true;
    dispatch(setLoading(true));
    GetFolderStructure();
    return () => {
      isMounted = false;
    };
  }, []);

  async function GetOneUser() {
    let userslist = JSON.parse(readFile("userslist"));
    if (userslist?.length > 0) {
      dispatch(setUsersList(userslist));
      let firstuser = userslist[0]?.auth?.user;
      return JSON.parse(readFile(inboxpath(firstuser, "user")))
        ? JSON.parse(readFile(inboxpath(firstuser, "user")))
        : null;
    }
  }

  async function GetFolderStructure() {
    try {
      if (!user) {
        let data = await GetOneUser();
        if (data) {
          setActiveUser(data);
          dispatch(setUser(data));
          userHome = data?.auth?.user;
          GetStructure(userHome, data);
        }
      } else {
        GetStructure(user?.auth?.user, user);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function GetStructure(userHome, data) {
    let folder = await ParseContent(inboxpath(userHome, "conf"));
    if (folder) {
      DispatchFolderStructure(folder, data);
    } else {
      client = new ImapFlow(data);
      let val = await GetFolderStructureFromServer(
        client,
        inboxpath(userHome, "conf"),
        MailPath
      );
      DispatchFolderStructure(val, data);
    }
  }

  async function DispatchFolderStructure(folder, data) {
    if (folder) {
      settLen(folder?.mailStatus?.messages);
      let fetchlimit =
        userDefinedFetchLimit ? folder?.mailStatus?.messages > userDefinedFetchLimit
          ? userDefinedFetchLimit : folder?.mailStatus?.messages : folder?.mailStatus?.messages > 50 ? 50 : folder?.mailStatus?.messages
      setfLimit(fetchlimit);
      dispatch(setMailStats(folder));
      dispatch(setFolderStrucure(folder?.folderTree));
      let mailfromlocal = await CheckForMailExistense(
        inboxpath(data?.auth?.user, "mail")
      );
      if (mailfromlocal) {
        DispatchMails(mailfromlocal.Mail, mailfromlocal?.Body);
        await UpdateArrayWithLatestMail(data);
      } else {
        client = new ImapFlow(data);
        let obj = await fetchMail(
          false,
          false,
          data,
          "INBOX",
          fetchlimit,
          fetchedCount,
          client
        );
        DispatchMails(obj.Mail, obj.parsedjson);
        delete obj.parsedjson;
        setStoreObj(obj);
      }
    }
  }

  async function DispatchMails(envelopearray, Messagesarray) {
    dispatch(setEnvelope(envelopearray));
    dispatch(setAllMail(Messagesarray));
    setfetchedCount(envelopearray?.length);
    dispatch(setLoading(false));
  }

  useEffect(() => {
    if (StoreObj) {
      if (
        Object.values(StoreObj)[0]?.length > 0 &&
        Object.values(StoreObj)[1]?.length > 0 &&
        Object.values(StoreObj)[0]?.length ===
        Object.values(StoreObj)[1]?.length &&
        store
      ) {
        StoreAsFile();
      }
    }
    return () => { };
  }, [StoreObj]);

  useEffect(() => {
    let isMounted = true;
    if (ActiveUser != user) {
      dispatch(setLoading(true));
      setisAnyMailOpen(false);
      GetFolderStructure();
    }
    return () => {
      isMounted = false;
    };
  }, [user]);

  function StoreAsFile() {
    if (!checkExists(path.join(userHome, "mail"))) {
      createFolder(path.join(userHome, "mail"));
      WriteFile(inboxpath(userHome, "mail"), StoreObj);
    } else {
      WriteFile(inboxpath(userHome, "mail"), StoreObj);
    }
  }

  async function FetchUptoNextLimit() {
    dispatch(setLoading(true));
    let rlen = tLen - fetchedCount;
    client = new ImapFlow(user);
    let { Messagesarray, envelopearray } = await FetchMail(
      client,
      rlen < fLimit ? rlen : fLimit,
      fetchedCount,
      true,
      true,
      "INBOX"
    );
    if (envelopearray.length > 0 && Messagesarray.length > 0) {
      let envelopeconcat = envelopearray.concat(Envelope);
      let maillistconcat = Messagesarray?.concat(maillist);
      CallToaddLatestMail(envelopeconcat, maillistconcat);
      dispatch(setLoading(false));
    }
  }

  async function UpdateArrayWithLatestMail(data) {
    updatedClient = new ImapFlow(data);
    let { count, latestmailwithenvelope, latestMessagesarray } =
      await OnUpdatedMailFromServer(updatedClient, tLen, "INBOX");
    if (latestmailwithenvelope?.length > 0 && latestMessagesarray?.length > 0) {
      let mailfromlocal = await ParseContent(
        path.join(data?.auth?.user, "mail", "mail")
      );
      if (mailfromlocal?.Mail?.length > 0 && mailfromlocal?.Body?.length > 0) {
        let envelopeconcat = mailfromlocal?.Mail?.concat(
          latestmailwithenvelope
        );
        let maillistconcat = mailfromlocal?.Body?.concat(latestMessagesarray);
        CallToaddLatestMail(envelopeconcat, maillistconcat);
        infoclient = new ImapFlow(data);
        getInformation(
          infoclient,
          "INBOX",
          path.join(userHome, "conf", "conf.txt")
        );
      }
    }
  }

  function CallToaddLatestMail(envelopeconcat, maillistconcat) {
    let obj = {};
    obj.Mail = envelopeconcat;
    obj.Body = maillistconcat;
    dispatch(setEnvelope(envelopeconcat));
    setfetchedCount(envelopeconcat?.length);
    dispatch(setAllMail(maillistconcat));
    setStoreObj(obj);
  }

  function SearchFor() {
    let FilteredData = Envelope?.filter(function (item) {
      return item?.subject?.toLowerCase().includes(SearchText?.toLowerCase());
    });
    if (FilteredData?.length > 0) {
      setFilteredData(FilteredData);
    } else {
      setFilteredData([]);
    }
  }

  if (loading) {
    return <Loading />;
  }
  return (
    <div>
      <Structure
        isAnyMailOpen={isAnyMailOpen}
        setisAnyMailOpen={setisAnyMailOpen}
        Data={Envelope?.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        })}
        openedmail={openedMail}
        setopenedmail={setopenedMail}
        composeopen={composeopen}
        setcomposeopen={setcomposeopen}
        message={maillist}
        Quota={MailStats?.quota}
        actionFromReply={ActionFromreply}
        setactionFromReply={setActionFromreply}
        searchText={SearchText}
        setsearchText={setSearchText}
        search={SearchFor}
        FilteredData={FilteredData}
        Status={tLen}
        FetchUptoNextLimit={FetchUptoNextLimit}
        Refresh={() => UpdateArrayWithLatestMail(user)}
        MailStats={MailStats}
        folderStructure={folderStructure}
        userHome={userHome}
        userslist={userslist}
        user={user}
      />
    </div>
  );
}

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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
