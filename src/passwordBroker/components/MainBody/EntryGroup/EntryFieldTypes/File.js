import React from "react"
import prettyBytes from "pretty-bytes";

const File = ({fileName, fileSize, fileMime}) => {
    const fileSizePrettified = prettyBytes(fileSize)
    return (
        <React.Fragment>
            <div className="px-2 basis-1/6">
                <span className="text-slate-400 pr-3" >name: </span>
                <span>
                    {fileName}
                </span>
            </div>
            <div className="px-2 basis-1/6">
                <span className="text-slate-400 pr-3" >mime: </span>
                <span>
                    {fileMime}
                </span>
            </div>
            <div className="px-2 basis-1/6">
                <span className="text-slate-400 pr-3" >size: </span>
                <span>
                    {fileSizePrettified}
                </span>
            </div>
        </React.Fragment>
    )
}

export default File