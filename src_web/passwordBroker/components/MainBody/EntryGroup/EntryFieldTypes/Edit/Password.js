import React from 'react';
import {Input} from 'react-daisyui';

const Password = ({entryId, fieldLogin, fieldValue, changeLogin, changeValue}) => {
    return (
        <div className="items-center py-1.5">
            <div className="flex flex-row ">
                <label htmlFor={'add-field-for-' + entryId + '-login'} className="inline-block basis-1/3 text-lg">
                    Login:
                </label>
                <Input
                    id={'add-field-for-' + entryId + '-login'}
                    className={
                        'input-bordered input-sm basis-2/3 bg-slate-800' + ' text-slate-200 placeholder-slate-300'
                    }
                    onChange={e => changeLogin(e.target.value)}
                    placeholder="type new login"
                    type="text"
                    value={fieldLogin}
                />
            </div>
            <div className="flex flex-row ">
                <label htmlFor={'add-field-for-' + entryId + '-value'} className="inline-block basis-1/3 text-lg">
                    Password:
                </label>
                <Input
                    id={'add-field-for-' + entryId + '-value'}
                    className={
                        'input-bordered input-sm basis-2/3 bg-slate-800' + ' text-slate-200 placeholder-slate-300'
                    }
                    onChange={e => changeValue(e.target.value)}
                    placeholder="type new password"
                    type="password"
                    value={fieldValue}
                />
            </div>
        </div>
    );
};

export default Password;
