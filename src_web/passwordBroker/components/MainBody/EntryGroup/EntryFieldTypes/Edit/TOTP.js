import React from 'react';
import {Input} from 'react-daisyui';

const TOTP = ({entryId, fieldValue, changeValue}) => {
    return (
        <div className="items-center py-1.5">
            <div className="flex flex-row pb-1">
                <label htmlFor={'add-field-for-' + entryId + '-totp'} className="inline-block basis-1/3 text-lg">
                    OTP secret key:
                </label>
                <Input
                    id={'add-field-for-' + entryId + '-value'}
                    className={'basis-2/3 bg-slate-800 text-slate-200 placeholder-slate-300'}
                    onChange={e => changeValue(e.target.value)}
                    placeholder="put OTP secret key here"
                    type="text"
                    size="sm"
                    value={fieldValue}
                />
            </div>
        </div>
    );
};

export default TOTP;
