import React from 'react';
const Link = ({value}) => {
    return (
        <div className="col-span-3 basis-1/2 px-2">
            <a href={value} className="link" target="_blank" rel="noreferrer">
                {value}
            </a>
        </div>
    );
};

export default Link;
