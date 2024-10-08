import React from 'react';
import CopyToClipboard from './CopyToClipboard';
const Note = ({value, title = ''}) => {
    return (
        <div className="col-span-3 basis-1/2 px-2">
            <CopyToClipboard value={value} message={`Note for "${title}" copied`}>
                <div className="whitespace-pre-line">{value}</div>
            </CopyToClipboard>
        </div>
    );
};

export default Note;
