import React from 'react';
import {Input} from 'react-daisyui';

const Link = ({entryId, fieldValue, changeValue}) => {
    return (
        <div className="flex flex-row items-center py-1.5">
            <label htmlFor={'add-field-for-' + entryId + '-value'} className="inline-block basis-1/3 text-lg">
                Link:
            </label>
            <Input
                id={'add-field-for-' + entryId + '-value'}
                className="input-bordered input-sm basis-2/3 bg-slate-800 text-slate-200 placeholder-slate-300"
                onChange={e => changeValue(e.target.value)}
                placeholder="put new link"
                type="text"
                value={fieldValue}
            />
        </div>
    );
};

export default Link;
