import React from 'react';
const Note = ({value}) => {
    return (
        <div className="col-span-3 basis-1/2 px-2">
            <div className="whitespace-pre-line">{value}</div>
        </div>
    );
};

export default Note;
