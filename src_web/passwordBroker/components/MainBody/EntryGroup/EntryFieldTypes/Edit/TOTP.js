import React from 'react';
import {Input} from 'react-daisyui';
import {
    ENTRY_GROUP_ENTRY_FIELD_TOTP_ALGORITHM_DEFAULT,
    ENTRY_GROUP_ENTRY_FIELD_TOTP_ALGORITHM_SHA1,
    ENTRY_GROUP_ENTRY_FIELD_TOTP_ALGORITHM_SHA256,
    ENTRY_GROUP_ENTRY_FIELD_TOTP_ALGORITHM_SHA512,
} from '../../../../../../../src_shared/passwordBroker/constants/EntryGroupEntryFieldTOTPAlgorithms';

const TOTP = ({
    entryId,
    fieldValue,
    changeValue,
    addingFieldTOTPAlgorithm,
    changeTOTPAlgorithm,
    addingFieldTOTPTimeout,
    changeTOTPTimeout,
}) => {
    return (
        <div className="items-center py-1.5">
            <div className="flex flex-row pb-1">
                <label htmlFor={'add-field-for-' + entryId + '-totp'} className="inline-block basis-1/3 text-lg">
                    OTP secret key:
                </label>
                <Input
                    id={'add-field-for-' + entryId + '-totp'}
                    className={'basis-2/3 bg-slate-800 text-slate-200 placeholder-slate-300'}
                    onChange={e => changeValue(e.target.value)}
                    placeholder="put OTP secret key here"
                    type="text"
                    size="sm"
                    value={fieldValue}
                />
            </div>
            <div className="flex flex-row items-center py-1.5">
                <label
                    htmlFor={'add-field-for-' + entryId + '-hash-algorithm'}
                    className="inline-block basis-1/3 text-lg">
                    Hash Algorithm:
                </label>
                <select
                    id={'add-field-for-' + entryId + '-hash-algorithm'}
                    className="select select-bordered select-sm basis-2/3 bg-slate-800 text-slate-200"
                    value={addingFieldTOTPAlgorithm ?? ENTRY_GROUP_ENTRY_FIELD_TOTP_ALGORITHM_DEFAULT}
                    onChange={e => changeTOTPAlgorithm(e.target.value)}>
                    <option value={ENTRY_GROUP_ENTRY_FIELD_TOTP_ALGORITHM_SHA1}>
                        {ENTRY_GROUP_ENTRY_FIELD_TOTP_ALGORITHM_SHA1} [default]
                    </option>
                    <option value={ENTRY_GROUP_ENTRY_FIELD_TOTP_ALGORITHM_SHA256}>
                        {ENTRY_GROUP_ENTRY_FIELD_TOTP_ALGORITHM_SHA256}
                    </option>
                    <option value={ENTRY_GROUP_ENTRY_FIELD_TOTP_ALGORITHM_SHA512}>
                        {ENTRY_GROUP_ENTRY_FIELD_TOTP_ALGORITHM_SHA512}
                    </option>
                </select>
            </div>
            <div className="flex flex-row pb-1">
                <label
                    htmlFor={'add-field-for-' + entryId + '-totp-timeout'}
                    className="inline-block basis-1/3 text-lg">
                    Timeout:
                </label>
                <Input
                    id={'add-field-for-' + entryId + '-totp-timeout'}
                    className={'basis-2/3 bg-slate-800 text-slate-200 placeholder-slate-300'}
                    onChange={e => changeTOTPTimeout(e.target.value)}
                    type="number"
                    min="1"
                    max="10000"
                    step="1"
                    placeholder="put timeout here"
                    required={true}
                    size="sm"
                    value={addingFieldTOTPTimeout}
                />
            </div>
        </div>
    );
};

export default TOTP;
