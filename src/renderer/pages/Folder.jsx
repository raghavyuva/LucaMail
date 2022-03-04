import React, { useEffect, useState } from "react";
import Structure from "../utils/Structure";
import { FetchMail, OnUpdatedMailFromServer } from "../services";
import { useDispatch, connect } from "react-redux";
import { setAllMail } from "../redux/actions/MailList";
import Loading from "~/components/Loading/Loading";
import { checkExists, readFile, WriteFile } from "~/lib/fileAction";
import { getInformation } from "~/services/flow";
import { setEnvelope } from "~/redux/actions/MailList";
import { SettingTypes } from "../static/constants/Settings";
import { setLoading } from "../redux/actions/LoadingActions";
import { setFolderStrucure, setMailStats } from "../redux/actions/appActions";
import { ParseContent } from "../utils/Utils";
import { useLocation } from "react-router-dom";
const { ImapFlow } = window.require("imapflow");
const path = require("path");

function Folder({
  user,
  currentSideBar,
  loading,
  MailStats,
  Envelope,
  maillist,
  folderStructure,
}) {
  const location = useLocation();
  let StorePath = location?.state?.substring(
    location?.state?.lastIndexOf("/") + 1
  );
  const MailPath = location?.state;
  const [StoreObj, setStoreObj] = useState();
  const [isAnyMailOpen, setisAnyMailOpen] = useState(false);
  const [openedMail, setopenedMail] = useState("");
  const [composeopen, setcomposeopen] = useState(false);
  const [ActionFromreply, setActionFromreply] = useState("newcompose");
  const [SearchText, setSearchText] = useState("");
  const [FilteredData, setFilteredData] = useState([]);
  const [InfoData] = useState(
    JSON.parse(readFile(path.join("conf", "conf.txt")))
      ? JSON.parse(readFile(path.join("conf", "conf.txt")))
      : 0
  );
  const [tLen, settLen] = useState(InfoData?.mailStatus?.messages);
  const [fLimit, setfLimit] = useState(tLen ? (tLen > 50 ? 20 : tLen) : 1);
  const [fetchedCount, setfetchedCount] = useState(
    JSON.parse(readFile(path.join("mail", MailPath)))
      ? JSON.parse(readFile(path.join("mail", MailPath)))?.Mail?.length
      : 0
  );
  const dispatch = useDispatch();
  let SettingFromStorage = JSON.parse(localStorage.getItem("Settings"));
  const [store] = useState(
    SettingFromStorage
      ? SettingFromStorage[2].default
      : SettingTypes["boolvaled"][2].default
  );
  let infoclient, client;
  useEffect(() => {
    let isMounted = true;
    dispatch(setLoading(true));
    GetFolderStructure();
    return () => {
      isMounted = false;
    };
  }, [location.state]);

  async function GetFolderStructure() {
    try {
      let folder = await ParseContent("conf", "conf.txt");
      if (folder) {
        DispatchFolderStructure(folder);
      } else {
        client = new ImapFlow(user);
        GetFolderStructureFromServer(client);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function GetFolderStructureFromServer(client) {
    if (!checkExists(path.join("conf", StorePath))) {
      let folder = await getInformation(client, MailPath, StorePath);
      DispatchFolderStructure(folder);
    }
  }

  async function DispatchFolderStructure(folder) {
    if (folder) {
      settLen(folder?.mailStatus?.messages);
      let fetchlimit =
        folder?.mailStatus?.messages > 50 ? 20 : folder?.mailStatus?.messages;
      setfLimit(fetchlimit);
      dispatch(setMailStats(folder));
      dispatch(setFolderStrucure(folder?.folderTree));
      CheckForMailExistense();
    }
  }

  async function CheckForMailExistense() {
    try {
      let mailfromlocal = await ParseContent("mail", StorePath);
      if (mailfromlocal?.Mail?.length > 0 && mailfromlocal?.Body?.length > 0) {
        DispatchMails(mailfromlocal.Mail, mailfromlocal?.Body);
        await UpdateArrayWithLatestMail();
      } else {
        parseToFn();
      }
    } catch (error) {
      console.log(error);
    }
  }

  function parseToFn() {
    fetchMail(false, false);
  }

  async function fetchMail(again, withlimit) {
    client = new ImapFlow(user);
    let { Messagesarray, envelopearray } = await FetchMail(
      client,
      fLimit,
      fetchedCount,
      withlimit,
      again,
      MailPath
    );
    if (envelopearray.length > 0 && Messagesarray.length > 0) {
      DispatchMails(envelopearray, Messagesarray);
      let obj = {};
      obj.Mail = envelopearray;
      obj.Body = Messagesarray;
      setStoreObj(obj);
    }
  }

  async function DispatchMails(envelopearray, Messagesarray) {
    dispatch(setEnvelope(envelopearray));
    dispatch(setAllMail(Messagesarray));
    setfetchedCount(envelopearray?.length);
    setTimeout(() => {
      dispatch(setLoading(false));
    }, 500);
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
    return () => {};
  }, [StoreObj]);

  function StoreAsFile() {
    WriteFile(path.join("mail", StorePath), StoreObj);
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
      MailPath
    );
    if (envelopearray.length > 0 && Messagesarray.length > 0) {
      let envelopeconcat = envelopearray.concat(Envelope);
      let maillistconcat = Messagesarray?.concat(maillist);
      CallToaddLatestMail(envelopeconcat, maillistconcat);
      dispatch(setLoading(false));
    }
  }

  async function UpdateArrayWithLatestMail() {
    let updatedClient = new ImapFlow(user);

    let { latestmailwithenvelope, count, latestMessagesarray } =
      await OnUpdatedMailFromServer(updatedClient, tLen, MailPath);

    if (latestmailwithenvelope?.length > 0 && latestMessagesarray?.length > 0) {
      let mailfromlocal = await ParseContent("mail", MailPath);
      if (mailfromlocal?.Mail?.length > 0 && mailfromlocal?.Body?.length > 0) {
        let envelopeconcat = mailfromlocal?.Mail?.concat(
          latestmailwithenvelope
        );
        let maillistconcat = mailfromlocal?.Body?.concat(latestMessagesarray);
        CallToaddLatestMail(envelopeconcat, maillistconcat);
      }
    }
    infoclient = new ImapFlow(user);
    getInformation(infoclient, MailPath, StorePath);
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
        // FetchLimit={fLimit}
        FetchUptoNextLimit={FetchUptoNextLimit}
        Refresh={UpdateArrayWithLatestMail}
        MailStats={MailStats}
        folderStructure={folderStructure}
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
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Folder);
