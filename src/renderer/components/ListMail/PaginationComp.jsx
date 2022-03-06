import React from 'react'

function PaginationComp({
    FetchUptoNextLimit
}) {
    return (


        <div className="flex self-end  text-text">
            <button title="fetch more" type="button" className="inline-flex items-center justify-center self-end w-8 h-8 py-0 bg-MailCardBackground rounded-md shadow-md "
                onClick={() => FetchUptoNextLimit()}
            >
                <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
        </div>


    )
}

export default PaginationComp
 