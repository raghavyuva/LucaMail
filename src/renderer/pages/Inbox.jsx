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
}) {
  let MailPath = currentSideBar?.path ? currentSideBar?.path : "INBOX";
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
    JSON.parse(readFile(path.join("mail", "mail")))
      ? JSON.parse(readFile(path.join("mail", "mail")))?.Mail?.length
      : 0
  );
  const dispatch = useDispatch();
  let SettingFromStorage = JSON.parse(localStorage.getItem("Settings"));
  const [store] = useState(
    SettingFromStorage
      ? SettingFromStorage[2].default
      : SettingTypes["boolvaled"][2].default
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

  async function GetFolderStructure() {
    try {
      let folder = await ParseContent("conf", "conf.txt");
      console.log(folder)
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
    if (!checkExists(path.join("conf", "conf.txt"))) {
      let folder = await getInformation(client, MailPath, "conf.txt");
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
      let mailfromlocal = await ParseContent("mail", "mail");
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
      "INBOX"
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
    return () => {};
  }, [StoreObj]);

  function StoreAsFile() {
    WriteFile(path.join("mail", "mail"), StoreObj);
  }

  async function FetchUptoNextLimit() {
    dispatch(setLoading(true));
    let rlen = tLen - fetchedCount;
    console.log(tLen, fetchedCount, rlen);
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

  async function UpdateArrayWithLatestMail() {
    updatedClient = new ImapFlow(user);

    let { latestmailwithenvelope, count, latestMessagesarray } =
      await OnUpdatedMailFromServer(updatedClient, tLen, "INBOX");

    if (latestmailwithenvelope?.length > 0 && latestMessagesarray?.length > 0) {
      let mailfromlocal = await ParseContent("mail", "mail");
      if (mailfromlocal?.Mail?.length > 0 && mailfromlocal?.Body?.length > 0) {
        let envelopeconcat = mailfromlocal?.Mail?.concat(
          latestmailwithenvelope
        );
        let maillistconcat = mailfromlocal?.Body?.concat(latestMessagesarray);
        CallToaddLatestMail(envelopeconcat, maillistconcat);
      }
    }
    infoclient = new ImapFlow(user);
    getInformation(infoclient, "INBOX", "conf.txt");
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
