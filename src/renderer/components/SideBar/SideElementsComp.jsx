import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setAuthenticated } from '~/redux/actions/UserActions';
import { setAllMail, setEnvelope } from '../../redux/actions/MailList';
const { ipcRenderer } = require("electron")
const ipc = ipcRenderer;
const os = require("os");
const homedir = os.homedir();
var fs = require('fs');
const path = require("path")
let appPath = "luca"
function SideElementsComp(
    {
        index,
        label,
        Icon,
        active,
        link,
        bottom,
    }
) {
    const [visible] = useState(false);
    const dispatch = useDispatch()


    return (
        <Link to={{
            pathname: !bottom ?
                label?.toLowerCase().includes("inbox") ? "/"
                    : `/folder/:${label}` : label?.toLowerCase().includes("settings") ? "/settings" : "/",
            state: link
        }}
            state={
                link
            }
            onClick={() => {
                if (label.toLowerCase().includes('logout')) {
                    try {
                        fs.rmSync(path.join(homedir, appPath), { recursive: true, force: true });
                        dispatch(setEnvelope([]));
                        dispatch(setAllMail([]))
                        dispatch(setAuthenticated(false))
                    } catch (error) {
                        alert("error logging out")
                    }
                }
            }}
            className={`${active === label ? '' : "opacity-100 "}  my-2     cursor-pointer opacity-90    no-underline  `}
        >
            <div className='flex justify-between flex-row items-center '>
                <div className={`z-50 rounded-md  items-center flex flex-row p-1   justify-self-start transform  duration-300 ease-in-out ${visible && ' '}`}>
                    {Icon && <Icon
                        className={` ${active == label? 'bg-primary text-primary-background' : " bg-primary-background  text-primary-text"} p-2 rounded-lg shadow-lg `}
                        size={30}
                    />}

                    <div >
                        <span className='text-primary-text capitalize    font-semibold pl-2  no-underline '>
                            {label}
                        </span>
                    </div>
                </div>
            </div>
        </Link >
    )
}

export default SideElementsComp
