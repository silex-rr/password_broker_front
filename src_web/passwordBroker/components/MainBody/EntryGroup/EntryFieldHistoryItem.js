import React, {useContext, useState} from "react";
import Moment from "react-moment";
import {PasswordBrokerContext} from "../../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext";
import {EntryGroupContext} from "../../../../../src_shared/passwordBroker/contexts/EntryGroupContext";


const EntryFieldHistoryItem = ({fieldProps, data}) => {

    const entryId = fieldProps.entry_id
    const fieldId = data.field_id
    const fieldEditLogId = data.field_edit_log_id

    const [decryptedValue, setDecryptedValue] = useState('')
    const [decryptedValueVisible, setDecryptedValueVisible] = useState(false)
    const [buttonLoading, setButtonLoading] = useState('')
    const [historyVisible, setHistoryVisible] = useState(false)

    const passwordBrokerContext = useContext(PasswordBrokerContext)
    const {
        baseUrl,
        entryGroupId,
    } = passwordBrokerContext

    const entryGroupContext = useContext(EntryGroupContext)
    const {
        loadEntryFieldValueAndButtons
    } = entryGroupContext

    const {
        value,
        buttons
    } = loadEntryFieldValueAndButtons(
        baseUrl + '/entryGroups/' + entryGroupId + '/entries/' + entryId + '/fields/' + fieldId + '/history/' + fieldEditLogId,
        {
            decryptedValue, setDecryptedValue,
            decryptedValueVisible, setDecryptedValueVisible,
            buttonLoading, setButtonLoading,
            historyVisible, setHistoryVisible
        },
        fieldProps,
        true
    );


    return (
        <div className="flex flex-row w-full">
            <div className="px-2 basis-1/6">
                {data.event_type}
            </div>
            <div className="px-2 basis-1/6">
                {data.user.name}
            </div>
            <div className="px-2 basis-1/6">
                <Moment format="YYYY.MM.DD HH:mm">
                    {data.created_at}
                </Moment>
            </div>
            <div className="px-2 basis-2/6">
                {value}
            </div>
            <div className="px-2 basis-1/6 flex justify-end py-1">
                {buttons}
            </div>
        </div>
    )
}

export default EntryFieldHistoryItem