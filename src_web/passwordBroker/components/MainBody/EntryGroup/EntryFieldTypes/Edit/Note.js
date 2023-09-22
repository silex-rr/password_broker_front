import React from 'react';
import {Textarea} from 'react-daisyui';

const Note = ({fieldValue, changeValue}) => {
    return (
        <div className="items-center py-1.5">
            <Textarea
                onChange={e => changeValue(e.target.value)}
                placeholder="type new note"
                value={fieldValue}
                className="textarea-bordered w-full bg-slate-800 text-slate-200 placeholder-slate-300"
            />
        </div>
    );
};

export default Note;
