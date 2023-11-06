import React from 'react';

const AuthSignupErrors = ({filedKey, errors, warnings}) => {
    let messages = [];
    if (errors[filedKey]) {
        messages = errors[filedKey].map((message, id) => (
            <li key={'r_error_' + id} className={'bg-red-300 px-2 py-1 text-sm text-slate-700'}>
                Error: {message}
            </li>
        ));
    }
    if (warnings[filedKey]) {
        messages = messages.concat(
            warnings[filedKey].map((message, id) => (
                <li key={'r_error_' + id} className={'bg-amber-300 px-2 py-1 text-sm text-slate-700'}>
                    Warning {message}
                </li>
            )),
        );
    }
    return <ul key={'validation_' + filedKey}>{messages}</ul>;
};

export default AuthSignupErrors;
