import React from 'react';
import CopyToClipboard from './CopyToClipboard';

const Password = ({login, value, title = ''}) => {
    return (
        <React.Fragment>
            <div className="basis-1/4">
                <CopyToClipboard className="px-2" value={login} message={`Login for "${title}" copied`}>
                    <span className="pr-3 text-slate-400">login: </span>
                    <span>{login}</span>
                </CopyToClipboard>
            </div>
            <div className="basis-1/4">
                <CopyToClipboard className="basis-1/4 px-2" value={value} message={`Password for "${title}" copied`}>
                    <span className={value === '' ? 'hidden' : 'pr-3 text-slate-400'}>pass: </span>
                    <span>{value}</span>
                </CopyToClipboard>
            </div>
        </React.Fragment>
    );
};

export default Password;
