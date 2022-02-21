import React from 'react'
import { Supporting } from './constant'

function SupportCard() {
    return (
        <div>
            <aside
                className="flex  bg-gradient-to-tl from-primary-background to-primary rounded-tl-2xl rounded-br-2xl  shadow-lg  py-2 px-2  mr-2 rounded-sm  justify-center items-center flex-col "
            >
                <h3 className="text-xl font-bold ">{Supporting.title}</h3>

                <p className=" text-sm text-gray-500 ">
                    {Supporting.tagline}
                </p>
                <a
                    href="https://ko-fi.com/raghavyuva"
                    className="inline-flex items-center p-1   no-underline text-sm font-medium text-primary-text shadow-md  hover:bg-pink-600"
                >
                    {Supporting.btn}
                </a>
            </aside>
        </div>
    )
}

export default SupportCard
