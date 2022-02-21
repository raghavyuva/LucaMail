import React, { useEffect, useState } from 'react'
import Structure from '../utils/Structure'
import {
    FetchMail,
    OnUpdatedMailFromServer,
} from '../services';
import { useDispatch, connect } from 'react-redux';
import { setAllMail } from '../redux/actions/MailList';
import Loading from '~/components/Loading/Loading';
import {
    checkExists,
    createFolder,
    readFile,
    WriteFile
} from '~/lib/fileAction';
import { getInformation } from '~/services/flow';
import { setEnvelope } from '~/redux/actions/MailList';
import { SetInfoForFirstTime } from '../services/flow';
import { SettingTypes } from '../static/constants/Settings';
import { setUser } from '../redux/actions/UserActions';
const { ImapFlow } = window.require("imapflow");
const path = require("path");

function Home({ maillist, Envelope, clientconfig }) {
    let config = JSON.parse((readFile(path.join(
        "user",
        "user.txt")))) ? JSON.parse((readFile(path.join(
            "user",
            "user.txt"))))
        : null
    const [Mail, setMail] = useState([]);
    const [Body, setBody] = useState([])
    const [load, setload] = useState(true);
    const [envelope, setenvelope] = useState([])
    const [isAnyMailOpen, setisAnyMailOpen] = useState(false);
    const [openedMail, setopenedMail] = useState('');
    const [composeopen, setcomposeopen] = useState(false);
    const [ActionFromreply, setActionFromreply] = useState('newcompose')
    const [SearchText, setSearchText] = useState('');
    const [FilteredData, setFilteredData] = useState([]);
    const [updatedMail, setupdatedMail] = useState([])
    const [updatedBody, setupdatedBody] = useState([])
    const [InfoData, setInfoData] = useState(
        (JSON.parse(readFile(path.join("conf",
            "conf.txt"))) ?
            JSON.parse(readFile(path.join("conf",
                "conf.txt"))) : 0
        ))

    const [tLen] = useState(InfoData?.mailStatus?.messages)
    const [fLimit] = useState(tLen ? tLen > 25 ? 25 : tLen : 10);
    const [fetchedCount, setfetchedCount] = useState(
        (JSON.parse(readFile(path.join("mail", "mail")))) ?
            ((JSON.parse(readFile(path.join("mail", "mail"))))?.Mail?.length) : 0
    )
    const [lmLen, setlmLen] = useState(0);
    const [cnt, setcnt] = useState(0);
    const [NewMail, setNewMail] = useState([]);
    const [NewBody, setNewBody] = useState([]);
    const dispatch = useDispatch();
    let client;
    let infoclient
    let SettingFromStorage = JSON.parse(localStorage.getItem("Settings"))

    const [store, setstore] = useState(
        SettingFromStorage ? SettingFromStorage[2].default :
            SettingTypes['boolvaled'][2].default
    )

    useEffect(() => {
        let isMounted = true;
        try {
            dispatch(setUser(config));
            if (InfoData == 0) {
                if (!checkExists(path.join("conf",
                    "conf.txt"))) {

                    infoclient = new ImapFlow(config)
                    SetInfoForFirstTime(infoclient, "INBOX", "conf.txt", setInfoData)

                } else {
                    setInfoData(JSON.parse(readFile(path.join("conf",
                        "conf.txt"))))
                }
            }
            if (!checkExists("mail") || !checkExists(path.join("mail",
                "mail"))) {
                createFolder("mail")
                parseToFn()
            } else {
                RetrieveData();
            }
        } catch (error) {
        }
        setTimeout(() => {
            setload(false)
        }, 2500);
        return () => {
            isMounted = false;
        }
    }, [])




    useEffect(() => {

        const interval = setInterval(() => {
            CheckForLatestMails()
        }, 600000);
        return () => {
            clearInterval(interval);
        }
    }, [])


    async function CheckForLatestMails() {
        await UpdateArrayWithLatestMail();
    }

    useEffect(() => {
        let isMounted = true;
        dispatch(setAllMail(Mail))
        if (fetchedCount == 0) {
            Mail?.map((e) => {
                setenvelope((el) => [...el, e?.envelope])
            })
        }
        if (
            fetchedCount < Mail?.length && store
        ) {
            storeMails()
            setcnt(cnt + 1)
        }
        return () => {
            isMounted = false;
        }
    }, [Mail])

    useEffect(() => {
        if (Mail?.length) {
            let result = [];
            result = envelope?.filter((e, i, a) => a.indexOf(e) === i)
            if (result.length > 0) {
                dispatch(setEnvelope(result))
            }
        }
        return () => {

        };
    }, [envelope]);





    function ReadData() {
        try {
            let mdata = JSON.parse(readFile(path.join("mail", "mail")))
            if (mdata?.Mail?.length > 0 && mdata?.Body?.length) {
                return mdata
            } else {
                return false
            }
        }
        catch (error) {
            return false
        }
    }

    async function RetrieveData() {
        try {
            let mdata = ReadData();
            if (Object.keys(mdata).length != 0) {
                setfetchedCount(mdata?.Mail?.length)
                mdata?.Mail?.map((ele) => {
                    setMail((p) => [...p, ele])
                    setenvelope((p) => [...p, ele?.envelope])
                })
                mdata?.Body?.map((itm) => {
                    setBody((p) => [...p, itm]);
                })
                await UpdateArrayWithLatestMail();
            } else {
                parseToFn()
            }
        } catch (error) {
            parseToFn()
        }
    }

    function parseToFn() {
        fetchMail(
            setMail,
            setBody,
            false,
            false
        )
    }


    function fetchMail(
        setMessages,
        setBody,
        again,
        withlimit
    ) {
        client = new ImapFlow(config)
        FetchMail(
            setMessages,
            setBody,
            client,
            fLimit,
            fetchedCount,
            withlimit,
            again,
            "INBOX"
        )
    }





    async function storeMails() {
        let obj = {};
        obj.Mail = Mail;
        obj.Body = Body;
        await WriteFile((path.join("mail", "mail")), obj)
    }


    function FetchUptoNextLimit() {
        let rlen = tLen - fetchedCount
        client = new ImapFlow(config)
        FetchMail(
            setupdatedMail,
            setupdatedBody,
            client,
            rlen < fLimit ? rlen : fLimit,
            fetchedCount,
            true,
            true,
            "INBOX"
        )
    }

    useEffect(() => {
        if (updatedMail.length > 0
            && updatedBody.length > 0) {
            updatedMail.forEach((val) => {
                setMail([...Mail, val])
                setenvelope([...envelope, val?.envelope])
            })
            updatedBody.forEach((val) => {
                setBody([...Body, val])
            })
        }
    }, [updatedMail,])

    function UpdateArrayWithLatestMail() {
        let updatedClient = new ImapFlow(config);
        OnUpdatedMailFromServer(
            updatedClient,
            setNewMail,
            setNewBody,
            tLen,
            setlmLen,
            Mail,
            Body,
            "INBOX"
        )
        infoclient = new ImapFlow(config)
        getInformation(infoclient, "INBOX", "conf.txt")
    }




    useEffect(() => {



        if (lmLen > 0) {
            CallToaddLatestMail()
        }

        return () => {

        };
    }, [NewMail, NewBody, lmLen]);

    function CallToaddLatestMail() {
        if (NewMail?.length == lmLen) {
            setBody((oldarray) => [...oldarray, ...NewBody])
            let mconcat = [];
            let enconcat = [];
            NewMail?.map((val) => {
                mconcat?.push((val))
                enconcat?.push(val?.envelope)
            })
            if (mconcat?.length == NewMail?.length &&
                enconcat?.length == NewMail?.length
            ) {
                setMail((oldarray) => [...oldarray, ...mconcat])
                setenvelope((oldarray) => [...oldarray, ...enconcat])
            }
        }
    }

    function SearchFor() {
        let FilteredData = Envelope?.filter(function (item) {
            return item?.subject?.toLowerCase().
                includes(SearchText?.toLowerCase());
        });
        if (FilteredData?.length > 0) {
            setFilteredData(FilteredData)
        } else {
            setFilteredData([])
        }
    }

    if (load) {
        return (
            <Loading />
        )
    }
    return (
        <div>
            <Structure
                DrawerContents
                isAnyMailOpen={isAnyMailOpen}
                setisAnyMailOpen={setisAnyMailOpen}
                Data={Envelope?.sort((a, b) => {
                    return new Date(b.date) - new Date(a.date);
                })}
                openedmail={openedMail}
                setopenedmail={setopenedMail}
                composeopen={composeopen}
                setcomposeopen={setcomposeopen}
                MailWithBody={Body}
                message={maillist}
                Quota={InfoData?.quota}
                actionFromReply={ActionFromreply}
                setactionFromReply={setActionFromreply}
                searchText={SearchText}
                setsearchText={setSearchText}
                search={SearchFor}
                FilteredData={FilteredData}
                Status={tLen}
                FetchLimit={fLimit}
                FetchUptoNextLimit={FetchUptoNextLimit}
                Refresh={UpdateArrayWithLatestMail}
                ConfData={InfoData}
            />
        </div>
    )
}

const mapStateToProps = (state) => ({
    loading: state.loadingDetails.loading,
    maillist: state.mailDetails.maillist,
    Envelope: state.mailDetails.Envelope
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Home);