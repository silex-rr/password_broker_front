import React, {useContext, useState} from "react";
import {PasswordBrokerContext} from "../../../contexts/PasswordBrokerContext";
import EntryFieldHistory from "./EntryFieldHistory";
import {EntryContext} from "../../../contexts/EntryContext";

const EntryField = (props) => {

    const fieldId = props.field_id
    const entryId = props.entry_id
    const type = props.type
    const title = props.title

    const [decryptedValue, setDecryptedValue] = useState('')
    const [decryptedValueVisible, setDecryptedValueVisible] = useState(false)
    const [buttonLoading, setButtonLoading] = useState('')
    const [historyVisible, setHistoryVisible] = useState(false)
    const [trashed, setTrashed] = useState(false)

//,

    const passwordBrokerContext = useContext(PasswordBrokerContext)
    const {
        baseUrl,
        entryGroupId,
    } = passwordBrokerContext

    const entryContext = useContext(EntryContext)
    const {
        loadEntryFieldValueAndButtons
    } = entryContext

    const {
        value,
        buttons
    } = loadEntryFieldValueAndButtons(
        baseUrl + '/entryGroups/' + entryGroupId + '/entries/' + entryId + '/fields/' + fieldId,
        {
            decryptedValue, setDecryptedValue,
            decryptedValueVisible, setDecryptedValueVisible,
            buttonLoading, setButtonLoading,
            historyVisible, setHistoryVisible,
            trashed, setTrashed
        },
        props
    );

    return (
        <React.Fragment key={fieldId}>
            <div className={"flex flex-row w-full px-2 bg-slate-500 hover:bg-slate-600 items-baseline" + (trashed ? " hidden":"")}>
                <div className="px-2 basis-1/6">{title}</div>
                <div className="px-2 basis-1/6">{type}</div>
                {value}
                <div className="px-2 basis-1/6 flex justify-end py-1">
                    {buttons}
                </div>
            </div>
            <EntryFieldHistory
                fieldProps={props}
                historyVisible={historyVisible}
            />
        </React.Fragment>
    )
}
export default EntryField