import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loading from "~/components/Loading/Loading";
import { checkExists, readFile, WriteFile } from "~/lib/fileAction";
import { FetchMail, OnUpdatedMailFromServer } from "~/services";
import { getInformation } from "~/services/flow";
import { config } from "~/static/constants/Config";
import Structure from "~/utils/Structure";
const { ImapFlow } = window.require("imapflow");
import { connect } from "react-redux";
import { SettingTypes } from "../static/constants/Settings";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/actions/UserActions";

const path = require("path");
function Folder({user}) {
  const [Mail, setMail] = useState([]);
  const [Body, setBody] = useState([]);
  const [envelope, setenvelope] = useState([]);
  const [load, setload] = useState(false);
  const [isAnyMailOpen, setisAnyMailOpen] = useState(false);
  const [openedMail, setopenedMail] = useState("");
  const [composeopen, setcomposeopen] = useState(false);
  const location = useLocation();
  let storepath = location?.state?.substring(
    location?.state?.lastIndexOf("/") + 1
  );
  const [ActionFromreply, setActionFromreply] = useState("newcompose");
  const [SearchText, setSearchText] = useState("");
  const [FilteredData, setFilteredData] = useState([]);
  const [Envarr, setEnvarr] = useState([]);
  const [lmLen, setlmLen] = useState(0);
  let InfoData = JSON.parse(readFile(path.join("conf", storepath)))
    ? JSON.parse(readFile(path.join("conf", storepath)))
    : 0;
  let tLen = InfoData?.mailStatus?.messages;
  let fLimit = tLen ? (tLen > 25 ? 25 : tLen) : 10;
  let infoclient;
  const [cnt, setcnt] = useState(0);
  const [updatedMail, setupdatedMail] = useState([]);
  const [updatedBody, setupdatedBody] = useState([]);
  const [NewMail, setNewMail] = useState([]);
  const [NewBody, setNewBody] = useState([]);
  const [fetchedCount, setfetchedCount] = useState(
    JSON.parse(readFile(path.join("mail", storepath)))
      ? JSON.parse(readFile(path.join("mail", storepath)))?.Mail?.length
      : 0
  );
  let SettingFromStorage = JSON.parse(localStorage.getItem("Settings"));

  const [store, setstore] = useState(
    SettingFromStorage
      ? SettingFromStorage[2].default
      : SettingTypes["boolvaled"][2].default
  );
const dispatch = useDispatch()
  useEffect(() => {
    setload(true);

    return () => {};
  }, []);

  useEffect(() => {
    if (!user) {
      dispatch(setUser(config));
    }
    SetVariablesOnLocChange();
    GetDetailsAboutFolder();

    return () => {};
  }, [location]);

  function SetVariablesOnLocChange() {
    setload(true);
    setMail([]);
    setBody([]);
    setEnvarr([]);
    setenvelope([]);
    setNewMail([]);
    setNewBody([]);
  }

  function GetDetailsAboutFolder() {
    if (!checkExists(path.join("conf", storepath))) {
      let client = new ImapFlow(user);
      getInformation(client, location?.state, storepath);
    }
    if (!checkExists(path.join("mail", storepath))) {
      RetrieveFromFolder();
    } else {
      RetrieveData();
    }
  }

  function ReadData() {
    try {
      let mdata = JSON.parse(readFile(path.join("mail", storepath)));
      if (mdata?.Mail?.length > 0 && mdata?.Body?.length) {
        return mdata;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  async function RetrieveData() {
    try {
      let mdata = ReadData();
      if (Object.keys(mdata)?.length != 0) {
        setfetchedCount(mdata?.Mail?.length);
        mdata?.Mail?.map((ele) => {
          setMail((p) => [...p, ele]);
          setenvelope((p) => [...p, ele?.envelope]);
        });
        mdata?.Body?.map((itm) => {
          setBody((p) => [...p, itm]);
        });
        await UpdateArrayWithLatestMail();
      } else {
        RetrieveFromFolder();
      }
    } catch (error) {
      RetrieveFromFolder();
    }
  }

  function RetrieveFromFolder() {
    setMail([]),
      setBody([]),
      setenvelope([]),
      setisAnyMailOpen(false),
      setEnvarr([]);
    infoclient = new ImapFlow(user);
    FetchMail(
      setMail,
      setBody,
      infoclient,
      fLimit,
      0,
      false,
      false,
      location?.state
    );
  }
  function FetchUptoNextLimit() {
    let rlen = tLen - envelope?.length;
    let client = new ImapFlow(user);
    FetchMail(
      setupdatedMail,
      setupdatedBody,
      client,
      rlen < fLimit ? rlen : fLimit,
      envelope?.length,
      true,
      true,
      location?.state
    );
  }

  useEffect(() => {
    if (Mail?.length) {
      let result = [];
      result = Mail?.filter((e, i, a) => a.indexOf(e) === i);
      result?.map((val) => {
        setEnvarr((vl) => [...vl, val?.envelope]);
      });
      setfetchedCount(result?.length);
    }
    if (fetchedCount < Mail?.length && store) {
      storeMails();
      setcnt(cnt + 1);
    }
    return () => {};
  }, [Mail]);

  async function storeMails() {
    let obj = {};
    obj.Mail = Mail;
    obj.Body = Body;
    await WriteFile(path.join("mail", storepath), obj);
  }

  function UpdateArrayWithLatestMail() {
    let updatedClient = new ImapFlow(user);
    OnUpdatedMailFromServer(
      updatedClient,
      setNewMail,
      setNewBody,
      tLen,
      setlmLen,
      Mail,
      Body,
      location?.state
    );
    infoclient = new ImapFlow(user);
    getInformation(infoclient, location?.state, storepath);
  }
  useEffect(() => {
    if (lmLen > 0) {
      CallToaddLatestMail();
    }
    return () => {};
  }, [NewMail, NewBody, lmLen]);

  useEffect(() => {
    if (Envarr) {
      let result = [];
      result = Envarr?.filter((e, i, a) => a.indexOf(e) === i);
      if (result.length == fetchedCount) {
        setload(false);
      }
      setenvelope(result);
    }
    return () => {};
  }, [Envarr, fetchedCount]);

  function CallToaddLatestMail() {
    if (NewMail?.length == lmLen) {
      setBody((oldarray) => [...oldarray, ...NewBody]);
      let mconcat = [];
      let enconcat = [];
      NewMail?.map((val) => {
        mconcat?.push(val);
        enconcat?.push(val?.envelope);
      });
      if (
        mconcat?.length == NewMail?.length &&
        enconcat?.length == NewMail?.length
      ) {
        setMail((oldarray) => [...oldarray, ...mconcat]);
        setenvelope((oldarray) => [...oldarray, ...enconcat]);
      }
    }
  }

  useEffect(() => {
    if (updatedMail.length > 0 && updatedBody.length > 0) {
      updatedMail.forEach((val) => {
        setMail([...Mail, val]);
        setenvelope([...envelope, val?.envelope]);
      });
      updatedBody.forEach((val) => {
        setBody([...Body, val]);
      });
    }
  }, [updatedMail]);

  function SearchFor() {
    let FilteredData = envelope?.filter(function (item) {
      return item?.subject?.toLowerCase().includes(SearchText?.toLowerCase());
    });
    if (FilteredData?.length > 0) {
      setFilteredData(FilteredData);
    } else {
      setFilteredData([]);
    }
  }

  if (load) {
    return <Loading count={Mail?.length} />;
  }

  return (
    <div>
      <Structure
        DrawerContents
        isAnyMailOpen={isAnyMailOpen}
        setisAnyMailOpen={setisAnyMailOpen}
        Data={envelope?.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        })}
        openedmail={openedMail}
        setopenedmail={setopenedMail}
        composeopen={composeopen}
        setcomposeopen={setcomposeopen}
        MailWithBody={Body}
        message={Mail}
        Quota={InfoData?.quota}
        actionFromReply={ActionFromreply}
        setactionFromReply={setActionFromreply}
        searchText={SearchText}
        setsearchText={setSearchText}
        search={SearchFor}
        FetchLimit={fLimit}
        FetchUptoNextLimit={FetchUptoNextLimit}
        FilteredData={FilteredData}
        Status={tLen}
        Refresh={UpdateArrayWithLatestMail}
        ConfData={InfoData}
      />
    </div>
  );
}

const mapStateToProps = (state) => ({
  loading: state.loadingDetails.loading,
  maillist: state.mailDetails.maillist,
  Envelope: state.mailDetails.Envelope,
  user:state.userDetails.user
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Folder);
