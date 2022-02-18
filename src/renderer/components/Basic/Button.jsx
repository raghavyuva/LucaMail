import React from 'react'

function Button({
    handler,
    btntext
}) {
    return (
        <div>
            <button className="inline-flex items-center px-8 py-3 font-medium bg-primary text-primary-background shadow-2xl  rounded-lg hover:opacity-75"
                onClick={handler}
            >
                {btntext}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 ml-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </button>
        </div>
    )
}

export default Button
