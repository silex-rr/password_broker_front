import React from "react";
import {Button} from "react-daisyui";
import EntryFieldsAdd from "./EntryFieldsAdd";
import EntryField from "./EntryField";

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
                 className="flex flex-row w-full bg-slate-800 text-slate-100 font-bold px-2">
                    <div className="basis-2/5">Title</div>
                    <div className="basis-1/5">Type</div>
                    <div className="basis-3/5">Value</div>
            </div>

            <div className="pb-3">
                {fields}
            </div>

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