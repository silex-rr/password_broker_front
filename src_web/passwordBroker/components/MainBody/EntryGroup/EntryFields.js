import React from 'react';
import EntryFieldsAdd from './EntryFieldsAdd';
import EntryField from './EntryField';
import EntryFieldsEdit from './EntryFieldsEdit';

const EntryFields = props => {
    const entryGroupId = props.entryGroupId;
    const entryId = props.entryId;
    const hideEdit = !!props.hideEdit;
    const hideAdd = !!props.hideAdd;

    const fields = [];

    for (let i = 0; i < props.fields.length; i++) {
        fields.push(<EntryField {...props.fields[i]} entry_group_id={entryGroupId} hideEdit={hideEdit} />);
    }

    return (
        <React.Fragment>
            <div key={entryId + '_fields'} className="flex w-full flex-row">
                <div className="basis-1/6 bg-slate-800 px-2 font-bold text-slate-100">Title</div>
                <div className="basis-1/6 bg-slate-800 px-2 font-bold text-slate-100">Type</div>
                <div className="basis-3/6 bg-slate-800 px-2 font-bold text-slate-100">Value</div>
                <div className="basis-1/6 bg-slate-800 px-2 font-bold text-slate-100">actions</div>
            </div>

            <div className="pb-3">{fields}</div>

            {hideEdit ? (
                ''
            ) : (
                <EntryFieldsEdit
                    entryGroupId={entryGroupId}
                    entryId={entryId}
                    entryTitle={props.entryTitle}
                    fields={props.fields}
                    setEntryFieldsStatus={props.setEntryFieldsStatus}
                />
            )}

            {hideAdd ? (
                ''
            ) : (
                <EntryFieldsAdd
                    entryGroupId={entryGroupId}
                    entryId={entryId}
                    entryTitle={props.entryTitle}
                    setEntryFieldsStatus={props.setEntryFieldsStatus}
                />
            )}
        </React.Fragment>
    );
};

export default EntryFields;
