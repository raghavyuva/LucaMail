import React, { useEffect, useState } from 'react'
import { ListOpenedBar } from '../../static/constants/ListTopContents'
import {
    EditorState,
} from 'draft-js';

import { AddSeenFlag, GetSingleMail } from '../../services';
import { config, } from '../../static/constants/Config';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import ShowTopIcons from './ShowTopIcons';
import DisplayMails from './DisplayMails';
import ComposeBox from './ComposeBox';
import { useLocation } from 'react-router-dom';
import { createFolder, WriteFile } from '~/lib/fileAction';
const { ImapFlow } = window.require("imapflow");
const os = require("os");
const homedir = os.homedir();
var fs = require('fs');
const path = require("path")
let appPath = "luca"
function ShowMail({
    openedmail,
    setopenedmail,
    composeopen,
    setcomposeopen,
    MailWithBody,
    message,
    actionFromReply,
    setactionFromReply,
    maillist,
    pathContents
}) {
    const { contents, rightcontent } = ListOpenedBar;
    const [ActiveMail, setActiveMail] = useState(null);
    const [Uid, setUid] = useState(undefined);
    const [ActiveIndex, setActiveIndex] = useState(0);
    const [editorState, setEditorState] = React.useState(
        () => EditorState.createEmpty(),
    );
    const [singleMail, setsingleMail] = useState();
    const [count, setcount] = useState(0);
    const location = useLocation();
    const [envelope, setenvelope] = useState([]);



    const [UpdatedMailStorage, setUpdatedMailStorage] = useState([]);

    useEffect(() => {
        for (let index = 0; index < MailWithBody?.length; index++) {
            if (MailWithBody[index]?.messageId === openedmail?.messageId) {
                setActiveIndex(index);
                setActiveMail(MailWithBody[index]);
                for (let x = 0; x < message?.length; x++) {
                    const element = message[x];
                    if (element.envelope?.messageId === MailWithBody[index]?.messageId) {
                        setUid(element.uid)
                    }
                }
            }
        }
    }, [openedmail, ActiveMail, MailWithBody, ActiveIndex])

    let client, client_single;
    useEffect(() => {
        client = new ImapFlow(config);
        client_single = new ImapFlow(config);
        let path = location?.pathname == '/' ? "INBOX" : location?.state;
        AddSeenFlag(client, Uid, path);
        GetSingleMail(client_single, Uid, setsingleMail, path)
    }, [ActiveMail, openedmail])


    useEffect(() => {
        UpdateTheArrayInLocalStorage()
    }, [singleMail])


    useEffect(() => {
        if (UpdatedMailStorage.length == message?.length) {
            UpdatedMailStorage?.map((d) => {
                setenvelope((prev) => [...prev, d?.envelope])
            })
        }
    }, [UpdatedMailStorage])



    useEffect(() => {

        if ((envelope?.length == UpdatedMailStorage?.length) && singleMail) {
            let obj = {};
            obj.Mail = UpdatedMailStorage;
            obj.Body = MailWithBody;
            WriteFile((path.join("mail",
                "mail")), obj)
        }
        return () => {

        };
    }, [envelope]);



    function DownloadAttachMents(attachement) {
        try {
            if (attachement) {
                const downloadPath = path.join(homedir, appPath, "downloads")
                if (!fs.existsSync(downloadPath)) {
                    createFolder("downloads")
                }
                let fileName = attachement.filename
                const buff = Buffer.from(attachement?.content)
                const stream = fs.createWriteStream(path.join(downloadPath, fileName)).write(buff)
                alert("download success")
            }
        } catch (error) {
            alert("error downloading")
        }
    }

    function UpdateTheArrayInLocalStorage() {
        setcount(count + 1);
        if (singleMail) {
            let filteredData = message.filter((data) => {
                if (data.envelope?.messageId != singleMail.envelope?.messageId) {
                    return data
                }
            })
            if (count == 2) {
                filteredData.push(singleMail)
                filteredData.map((data) => {
                    setUpdatedMailStorage((prevData) => [...prevData, data])
                })
            }
        }
    }

    return (
        <div className='p-2  bg-gradient-to-tr from-positive via-primary-background to-primary'>
            <div className='flex flex-row justify-between items-center mt-3  '>
                <div className='flex '>
                    {
                        contents?.map((item) => (
                            <ShowTopIcons
                                Icon={item.icon}
                                func={item.func}
                                id={Uid}
                                MailWithBody={MailWithBody}
                                ActiveMail={ActiveMail}
                                maillist={maillist}
                                message={message}
                                pathContents={pathContents}
                            />
                        ))
                    }
                </div>
                <div className='mr-11 flex-row flex'>
                    <div className='flex'>
                        {
                            rightcontent?.map((item) => (
                                <ShowTopIcons
                                    Icon={item.icon}
                                    func={item.tooltip}
                                    ActiveMail={ActiveMail}
                                    MailWithBody={MailWithBody}
                                    setActiveMail={setActiveMail}
                                    setopenedmail={setopenedmail}
                                    ActiveIndex={ActiveIndex}
                                    message={message}
                                />
                            ))
                        }
                    </div>
                </div>

            </div>
            <div className='p-2 mt-2'>
                {
                    ActiveMail &&
                    <DisplayMails
                        Html={ActiveMail.html}
                        time={ActiveMail?.date?.toString()}
                        username={ActiveMail.from.value[0].name}
                        subject={ActiveMail.subject}
                        text={ActiveMail.textAsHtml}
                        fromhtml={ActiveMail.from.html}
                        from={ActiveMail.from.value[0].address}
                        mailinfo={ActiveMail?.headerLines}
                        currMail={ActiveMail}
                        setcomposeopen={setcomposeopen}
                        composeopen={composeopen}
                        setactionFromReply={setactionFromReply}
                        actionFromReply={actionFromReply}
                        DownloadAttachMents={(file) => { DownloadAttachMents(file) }}
                    />
                }
            </div>
            {
                composeopen &&
                <div className='w-11/12'>
                    <div className='absolute bottom-4   right-8 ' >
                        <div className='flex flex-row justify-center self-center items-center  '>
                            <ComposeBox
                                editorState={editorState}
                                setEditorState={setEditorState}
                                composeopen={composeopen}
                                setcomposeopen={setcomposeopen}
                                toadress={ActiveMail?.from.value[0].address}
                                subject={ActiveMail.subject}
                                action={actionFromReply}
                            />
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default ShowMail

