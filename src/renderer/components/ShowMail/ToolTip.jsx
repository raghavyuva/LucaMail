import React from 'react'
import { MdInfoOutline } from 'react-icons/md'

function ToolTip({
    mailInfo
}) {
    return (
        <div>
            <div className="relative flex flex-col  group">
                <MdInfoOutline size={40} className='px-2' />
                <div className="absolute top-0 flex flex-col items-center hidden mt-6 group-hover:flex">
                    <div className="w-3 h-3 -mb-2 rotate-45 bg-black"></div>
                    <div className='relative z-50 p-2 text-xs leading-none text-white whitespace-pre-wrap bg-secondary shadow-lg'>
                        <span className='my-1'>{mailInfo[0]?.line}</span> <br />
                        <span className='my-1'>{mailInfo[7]?.line}</span><br />
                        <span className='my-1'>{mailInfo[15]?.line}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ToolTip
