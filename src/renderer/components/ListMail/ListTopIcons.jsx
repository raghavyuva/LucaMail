import React from 'react'
import { MdRefresh } from 'react-icons/md'
import PaginationComp from './PaginationComp'

function ListTopIcons({
    Refresh,

    TotalCount,
    FetchLimit,
    FetchUptoNextLimit,
    Data
}) {
    return (
        <div className='flex flex-col ' >
            <div className='  flex  mt-4 items-center justify-evenly'>
                <div className='flex flex-row'>
                    <MdRefresh
                        size={30}
                        className='mr-2 cursor-pointer '
                        onClick={Refresh}
                    />
                </div>
                <span className='font-mono font-semibold '>
                    {Data?.length} Fetched Messages
                </span>
                <div className='hidden lg:flex'>
                    <PaginationComp
                        TotalCount={TotalCount}
                        FetchLimit={FetchLimit}
                        FetchUptoNextLimit={FetchUptoNextLimit}
                    />
                </div>
            </div>
        </div>
    )
}

export default ListTopIcons
