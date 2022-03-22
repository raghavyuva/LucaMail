import React from 'react';
import { MdFileDownload } from 'react-icons/md';

function AttachMents({
    label,
    type,
    fileDownload,
    file
}) {

    function bytesToSize(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }

    return (
        <div class="flex flex-col p-4 bg-MailCardBackground justify-center  shadow-lg rounded-xl m-2" >
            <span class="p-2 text-text rounded-lg bg-gray-50"
                onClick={() => fileDownload(file)}
            >
                <MdFileDownload size={30} />
            </span>
            <h6 class="mt-2 font-medium text-text">{label}</h6>
            <span>
                {bytesToSize(file?.size)}
            </span>
            <p class="hidden mt-1 text-sm  sm:block">{type ? type.substring(type.lastIndexOf("/") + 1) : ""}</p>
        </div>
    )
}

export default AttachMents;
