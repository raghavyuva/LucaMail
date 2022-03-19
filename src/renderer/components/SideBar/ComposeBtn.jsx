import React from 'react'
import { HiPlus } from 'react-icons/hi'

function ComposeBtn({
    composeopen,
    setactionFromReply,
    setcomposeopen
}) {
    return (
        <div className='  flex mt-3'>
            <button
                className=' shadow-2xl  rounded-lg    text-center text-text items-center flex flex-row font-bold '
                onClick={() => {
                    setcomposeopen(!composeopen)
                    if (!composeopen) {
                        setactionFromReply('newcompose')
                    }
                }}
            >
                <HiPlus
                    size={32}
                    className='bg-primary p-2 rounded-lg text-background'
                />
                <div >
                    <span className='text-text capitalize p-1  font-bold  '>
                        Compose
                    </span>
                </div>
            </button>
        </div>
    )
}

export default ComposeBtn
