import React from "react"
import prettyBytes from "pretty-bytes";

const File = ({fileName, fileSize, fileMime}) => {
    const fileSizePrettified = prettyBytes(fileSize)
    return (
        <React.Fragment>
            <div className="px-2 basis-1/6">
                {fileName}
            </div>
            <div className="px-2 basis-1/6">
                {fileMime}
            </div>
            <div className="px-2 basis-1/6">
                {fileSizePrettified}
            </div>
        </React.Fragment>
    )
}

export default File