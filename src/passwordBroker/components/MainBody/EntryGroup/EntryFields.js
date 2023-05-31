import React from "react";
import EntryFieldsAdd from "./EntryFieldsAdd";
import EntryField from "./EntryField";
import EntryFieldsEdit from "./EntryFieldsEdit";

const EntryFields = (props) => {
    const entryGroupId = props.entryGroupId
    const entryId = props.entryId

    const fields = []

    for (let i = 0; i < props.fields.length; i++) {
        fields.push(EntryField(props.fields[i]))
    }

    return (
        <React.Fragment>

            <div key={entryId + '_fields'}
                 className="flex flex-row w-full">
                    <div className="bg-slate-800 text-slate-100 font-bold px-2 basis-1/6">Title</div>
                    <div className="bg-slate-800 text-slate-100 font-bold px-2 basis-1/6">Type</div>
                    <div className="bg-slate-800 text-slate-100 font-bold px-2 basis-3/6">Value</div>
                    <div className="bg-slate-800 text-slate-100 font-bold px-2 basis-1/6">actions</div>
            </div>

            <div className="pb-3">
                {fields}
            </div>

            <EntryFieldsEdit
                entryGroupId={entryGroupId}
                entryId={entryId}
                entryTitle={props.entryTitle}
                fields={props.fields}
                setEntryFieldsStatus = {props.setEntryFieldsStatus}
            />

            <EntryFieldsAdd
                entryGroupId={entryGroupId}
                entryId={entryId}
                entryTitle={props.entryTitle}
                setEntryFieldsStatus = {props.setEntryFieldsStatus}
            />
        </React.Fragment>
    )
}

export default EntryFields