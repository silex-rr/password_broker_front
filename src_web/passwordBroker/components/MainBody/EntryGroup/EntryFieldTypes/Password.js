import React from 'react';

const Password = ({login, value}) => {
    return (
        <React.Fragment>
            <div className="basis-1/4 px-2">
                <span className="pr-3 text-slate-400">login: </span>
                <span>{login}</span>
            </div>
            <div className="basis-1/4 px-2">
                <span className={value === '' ? 'hidden' : 'pr-3 text-slate-400'}>password: </span>
                <span>{value}</span>
            </div>
        </React.Fragment>
    );
};

export default Password;
