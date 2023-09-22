import React from 'react';
import {Input} from 'react-daisyui';

export const File = ({entryId, fieldValue, changeValue}) => {
    return (
        <div className="flex flex-row items-center py-1.5">
            <label htmlFor={'add-field-for-' + entryId + '-value'} className="inline-block basis-1/3 text-lg">
                File:
            </label>
            <Input
                id={'add-field-for-' + entryId + '-value'}
                className={
                    'file-input file-input-bordered file-input-sm w-full ' +
                    'basis-2/3 bg-slate-800 text-slate-200 placeholder-slate-300'
                }
                onChange={e => changeValue(e.target.value, e.target.files[0])}
                placeholder="add a file"
                type="file"
                value={fieldValue}
            />
        </div>
    );
};

export default File;
