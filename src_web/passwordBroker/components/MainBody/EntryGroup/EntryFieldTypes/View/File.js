import React from 'react';
import prettyBytes from 'pretty-bytes';

const File = ({fileName, fileSize, fileMime}) => {
    const fileSizePrettified = prettyBytes(fileSize);
    return (
        <React.Fragment>
            <div className="basis-1/6 px-2">
                <span className="pr-3 text-slate-400">name: </span>
                <span>{fileName}</span>
            </div>
            <div className="basis-1/6 px-2">
                <span className="pr-3 text-slate-400">mime: </span>
                <span>{fileMime}</span>
            </div>
            <div className="basis-1/6 px-2">
                <span className="pr-3 text-slate-400">size: </span>
                <span>{fileSizePrettified}</span>
            </div>
        </React.Fragment>
    );
};

export default File;
