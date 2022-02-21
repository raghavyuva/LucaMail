import React from 'react'
import { MdOutlineClose, MdMenu, MdArrowBack } from 'react-icons/md'
import { VscChromeMaximize, VscChromeMinimize } from "react-icons/vsc";
import { Link } from 'react-router-dom';
const { ipcRenderer } = window.require("electron")
const ipc = ipcRenderer;
const WindowBar = ({
  icon,
  isDrawerOpen,
  setisDrawerOpen
}) => {
  return (
    <div className=' h-8  top-0 bg-positive shadow-sm   flex p-2 justify-between  z-50  '>
      <div >
        {icon != 'back' ? <>
          {
            icon == false ?
              <>
              </>
              :
              <MdMenu
                size={20}
                className='mx-2 text-primary-text cursor-pointer'
                onClick={() => { setisDrawerOpen(!isDrawerOpen) }}
              />
          }
        </> :
          <>
            <Link to='/'>
              <MdArrowBack
                size={20}
                className='mx-2 text-primary-text cursor-pointer'
              />
            </Link>
          </>
        }
      </div>
      <div className='text-primary-text font-mono font-bold  titlebar'>
        LucaMail
      </div>
      <div className='flex flex-row justify-evenly '>
        <VscChromeMinimize
          size={20}
          onClick={() => ipc.send("minimizeApp")}
          className='mx-2 text-primary-text hover:bg-positive cursor-pointer'
        />
        <VscChromeMaximize
          size={20}
          onClick={() => ipc.send("maximizeApp")}
          className='mx-2 text-primary-text hover:bg-positive cursor-pointer'
        />
        <MdOutlineClose
          size={20}
          onClick={() => ipc.send("closeApp")}
          className='mx-2 text-primary-text hover:bg-positive cursor-pointer'
        />
      </div>
    </div>
  )
}
export default WindowBar;
