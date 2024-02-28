import React from 'react';
import CopyToClipboard from "./CopyToClipboard";
const Note = ({value}) => {
    return (
        <div className="col-span-3 basis-1/2 px-2">
            <CopyToClipboard value={value}>
                <div className="whitespace-pre-line">{value}</div>
            </CopyToClipboard>
        </div>
    );
};

export default Note;
