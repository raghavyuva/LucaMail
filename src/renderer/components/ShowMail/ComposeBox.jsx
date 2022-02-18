import { convertToHTML } from 'draft-convert';
import {
    convertToRaw
} from 'draft-js';
import React, { useEffect, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import {
    MdCancel,
    MdExpandLess
} from 'react-icons/md';
import { RiSendPlaneLine } from 'react-icons/ri';
import { config, sendConfig } from '../../static/constants/Config';
import { motion } from 'framer-motion'
import { Resizable } from 're-resizable';

const nodemailer = window.require('nodemailer')
const { ipcRenderer } = window.require("electron")
const ipc = ipcRenderer;
function ComposeBox({
    editorState,
    setEditorState,
    composeopen,
    setcomposeopen,
    toadress,
    subject,
    action
}) {
    const [toAddress, settoAdress] = React.useState(toadress);
    const [Subject, setSubject] = React.useState(subject);
    const [body, setbody] = React.useState('');
    const [isExpansion, setisExpansion] = useState(false)
    const blocks = convertToRaw(editorState?.getCurrentContent()).blocks;
    const value = blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
    const [File, setFile] = useState([]);
    const convertContentToHTML = () => {
        const currentContentAsHTML = convertToHTML(editorState?.getCurrentContent());
        setbody(currentContentAsHTML)
    }


    useEffect(() => {
        convertContentToHTML()
    }, [value])

    const uploadCallback = (file, callback) => {
        return new Promise((resolve, reject) => {
            const reader = new window.FileReader();
            reader.onloadend = async () => {
                let obj = {}
                obj.path = file?.path
                obj.filename = file?.name
                setFile((prevData) => [...prevData, obj]);
                resolve({ data: { link: URL.createObjectURL(file), } });
            };
            reader.readAsDataURL(file);
        });
    };

    return (
        <Resizable

            style={{
                backgroundColor: "black",
                color: "wheat"
            }}
            className=' mt-4  overflow-y-scroll  scroll-smooth    w-max  scrollbar-thin scrollbar-thumb-primary scrollbar-track-secondary  scrollbar-thumb-rounded-full scrollbar-track-rounded-full flex flex-col z-50 rounded-lg shadow-lg   '
        >

            <div >
                <div className="  flex justify-between w-full   rounded-2xl">
                    <button className="m-2"
                        onClick={() => {
                            setisExpansion(!isExpansion)
                        }}
                    >
                        <MdExpandLess size={25} className=' ' />
                    </button>
                    <button className="m-2"
                        onClick={() => setcomposeopen(!composeopen)}
                    >
                        <MdCancel size={25} className='' />
                    </button>
                </div>
            </div>
            <div className='p-2  m-2 mx-2   flex'>
                <span className='mr-2 '>
                    To:
                </span>
                <input type="text"
                    className=' w-full outline-none '
                    style={{
                        backgroundColor: "black",
                        color: "white"
                    }}
                    value={toAddress}
                    onChange={(e) => {
                        if (action == 'newcompose') {
                            settoAdress(e.target.value)
                        }
                    }}
                    placeholder='type to address '
                />
            </div>
            <div className='p-2  mx-2  flex'>
                <span className='mr-2 '>
                    Subject:
                </span>
                <input type="text"
                    value={Subject}
                    onChange={(e) => {
                        if (action == 'newcompose') {
                            setSubject(e.target.value)
                        }
                    }}
                    style={{
                        backgroundColor: "black",
                        color: "white"
                    }}
                    placeholder='type mail subject here'
                    className=' font-bold w-full outline-none '
                />
            </div>
            <div
                className='grow p-2 mx-2 max-h-full grid  rounded-2xl text-primary-text text-opacity-70   '
            >
                <Editor editorState={editorState}
                    defaultEditorState={editorState}
                    onEditorStateChange={setEditorState}
                    toolbar={{
                        options: ['inline', 'fontSize',
                            'fontFamily', "image", 'list',
                            'textAlign',
                            'emoji', 'remove', 'history',
                        ],
                        image: {
                            previewImage: true,
                            uploadEnabled: true,
                            urlEnabled: false,
                            uploadCallback: uploadCallback,
                            defaultSize: {
                                height: 100,
                                width: 100
                            },
                            alignmentEnabled: true
                        }
                    }}
                    editorClassName=''
                    toolbarStyle={{
                        backgroundColor: "black",
                        justifyContent: "space-between"
                    }}
                    wrapperClassName=''
                    className='opacity-70 max-w-full  
                max-h-full 
                '   wrapperStyle={{
                        backgroundColor: "black",
                        height:300
                    }}
                    
                    placeholder='Type your mail body'
                    editorStyle={{
                        // maxWidth: 700,
                        // maxHeight: 200,
                        // flexWrap: "wrap",
                        color: "white",
                        backgroundColor: "black",
                        width: "100%",

                    }}
                    toolbarCustomButtons={[
                        <div>
                            <button className="p-2 bg-primary items-center flex font-bold px-2 rounded-md shadow-lg m-2 z-50 "
                                onClick={() => SendMail(
                                    config.auth.user,
                                    toAddress,
                                    Subject,
                                    body,
                                    File,
                                    setFile
                                )}
                            >
                                Send
                                <RiSendPlaneLine size={25} className='  text-primary-text ' />
                            </button>
                        </div>
                    ]}
                />
            </div>
        </Resizable>
    )
}
async function SendMail(fromAddress, toAddress, subject, body, fileUri, setFile) {
    const transporter = nodemailer.createTransport(sendConfig);
    let mailOptions = {
        from: fromAddress,
        to: toAddress,
        subject: subject,
        text: body,
        html: body,
        attachments: fileUri?.length > 0 ? fileUri : false
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
        } else {
            alert("message sent successfully")
            setFile([])
            transporter.close();
        }
    })
}

export default ComposeBox;