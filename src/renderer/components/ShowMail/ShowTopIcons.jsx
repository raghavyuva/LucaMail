import React from 'react'
import { useLocation } from 'react-router-dom';
import { WriteFile } from '~/lib/fileAction';
import { AddFlag, MoveToFolder } from '~/services';
import { config } from '../../static/constants/Config';
const { ImapFlow } = window.require("imapflow");
const { ipcRenderer } = require("electron")
const ipc = ipcRenderer;
const Path = require("path");
function ShowTopIcons({
    Icon,
    func,
    id,
    ActiveMail,
    MailWithBody,
    setActiveMail,
    setopenedmail,
    ActiveIndex,
    maillist,
    message,
    pathContents
}) {
    const cx = new ImapFlow(config)
    const location = useLocation();
    function ForawrdBackward(move) {
        if (move == 'forward') {
            for (let index = 0; index < MailWithBody.length; index++) {
                if (MailWithBody[index]?.messageId === ActiveMail?.messageId
                    && ActiveIndex + 1 < MailWithBody?.length) {
                    const element = MailWithBody[index + 1];
                    setActiveMail(element)
                    setopenedmail(element)
                }
            }
        } else {
            for (let index = 0; index < MailWithBody.length; index++) {
                if (MailWithBody[index]?.messageId === ActiveMail?.messageId
                    && ActiveIndex - 1 < MailWithBody?.length && ActiveIndex != 0) {
                    const element = MailWithBody[index - 1];
                    setActiveMail(element)
                    setopenedmail(element)
                }
            }
        }
    }


    function RemoveFromStore() {
        let listupdated = MailWithBody?.filter((el) => {
            if (el.messageId != ActiveMail?.messageId) {
                return el
            }
        })
        let updatedmail = maillist?.filter((el) => {
            if (el.messageId != ActiveMail?.messageId) {
                return el
            }
        })
        let updatedmessage = message?.filter(el => {
            if (el.envelope.messageId != ActiveMail.messageId) {
                return el
            }

        })
        if (listupdated?.length == MailWithBody?.length - 1 &&
            updatedmail?.length == maillist?.length - 1 &&
            updatedmessage?.length == message?.length - 1
        ) {
            let obj = {};
            obj.Mail = updatedmessage;
            obj.Body = listupdated;
            WriteFile((Path.join("mail", "mail")), obj)
        }
    }





    function SelectFunction(func) {
        let path = location?.pathname == '/' ? "INBOX" : location?.state;
        switch (func) {
            case 'delete':
                const connection = new ImapFlow(config);
                let destpath;
                pathContents?.folderTree?.map((folder) => {
                    if (folder?.folders) {
                        folder?.folders?.map((folders) => {
                            if (folders?.path.toLowerCase().includes("trash") ||
                                folders?.path.toLowerCase().includes("bin")) {
                                destpath = folders.path
                            }
                        })
                    } else {
                        if (folder?.path.toLowerCase().includes("trash") ||
                            folder?.path.toLowerCase().includes("bin")) {
                            destpath = folder.path
                        }
                    }
                })
                MoveToFolder(connection, path, destpath, id)
                if (location?.pathname == '/') {
                    RemoveFromStore()
                }
                break;
            case 'spam':
                const con = new ImapFlow(config);
                AddFlag('$Phishing', path, id, con)
                
                break;
            case 'star':
                const client = new ImapFlow(config);
                AddFlag('\\Flagged', path, id, client)
                break;
            case 'backward':
                ForawrdBackward('backward')
                break;
            case 'forward':
                ForawrdBackward('forward')
                break;
            case 'archive':
                const x = new ImapFlow(config);
                AddFlag('Archive', path, id, x)
                break;
            default:
                alert('invalid function to handle')
                break;
        }
    }
    return (
        <div className=' cursor-pointer'
            onClick={() => SelectFunction(func)}
        >
            {
                <Icon size={35} className='text-primary-text  mr-4 bg-secondary p-2 rounded-lg' />}
        </div>
    )
}

export default ShowTopIcons
