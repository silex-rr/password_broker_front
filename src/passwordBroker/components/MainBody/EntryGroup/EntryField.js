import React from "react";
import {Button} from "react-daisyui";
import EntryFieldsAdd from "./EntryFieldsAdd";

const EntryField = (props) => {
    const fieldId = props.field_id
    const entryId = props.entry_id
    const type = props.type
    const title = props.title
    const createdBy = props.created_by
    const updateBy = props.update_by
    const createdAt = props.created_at
    const updatedAt = props.updated_at
    const encryptedValue = props.encrypted_value_base64
    const initializationVector = props.initialization_vector_base64

    const fields = []
    return (
        <div key={fieldId} className="flex flex-row w-full px-2 bg-slate-500">
            <div className="basis-2/5">{title}</div>
            <div className="basis-1/5">{type}</div>
            <div className="basis-3/5">{encryptedValue}</div>
        </div>
    )
}
export default EntryField