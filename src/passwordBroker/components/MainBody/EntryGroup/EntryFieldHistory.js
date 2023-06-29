import React, {useContext, useEffect, useState} from "react";
import {ClockLoader} from "react-spinners";
import axios from "axios";
import {PasswordBrokerContext} from "../../../contexts/PasswordBrokerContext";
import {
    ENTRY_GROUP_ENTRY_FIELD_HISTORY_LOADED, ENTRY_GROUP_ENTRY_FIELD_HISTORY_LOADING,
    ENTRY_GROUP_ENTRY_FIELD_HISTORY_NOT_LOADED
} from "../../../constants/EntryGroupEntryFieldHistoryStatus";
import EntryFieldHistoryItem from "./EntryFieldHistoryItem";

const EntryFieldHistory = ({fieldProps, historyVisible}) => {

    const fieldId = fieldProps.field_id
    const entryId = fieldProps.entry_id

    const passwordBrokerContext = useContext(PasswordBrokerContext)
    const {
        baseUrl,
        entryGroupId
    } = passwordBrokerContext

    const [historyStatus, setHistoryStatus] = useState(ENTRY_GROUP_ENTRY_FIELD_HISTORY_NOT_LOADED)
    const [historyData, setHistoryData] = useState([])

    useEffect(() => {
        if (!historyVisible
            || historyStatus === ENTRY_GROUP_ENTRY_FIELD_HISTORY_LOADED
            || historyStatus === ENTRY_GROUP_ENTRY_FIELD_HISTORY_LOADING
        ) {
            return
        }
        setHistoryStatus(ENTRY_GROUP_ENTRY_FIELD_HISTORY_LOADING)
        axios.get(baseUrl + '/entryGroups/' + entryGroupId + '/entries/' + entryId + '/fields/' + fieldId + '/history')
            .then((response) => {
                setHistoryData(response.data)
                setHistoryStatus(ENTRY_GROUP_ENTRY_FIELD_HISTORY_LOADED)
            })

    }, [baseUrl, entryGroupId, entryId, fieldId, historyVisible, historyStatus, setHistoryStatus, setHistoryData]);



    let history

    if (historyStatus === ENTRY_GROUP_ENTRY_FIELD_HISTORY_LOADED) {
        // console.log(historyData)
        history = []
        for (let i = 0; i < historyData.length; i++) {
            history.push(<EntryFieldHistoryItem
                key={historyData[i].field_edit_log_id}
                data={historyData[i]}
                fieldProps={fieldProps}
            />)
        }
        if (history.length === 0) {
            history =
                <div className="w-full py-2 flex items-center justify-center">
                    <span className="px-1">history is empty</span>
                </div>
        }
    } else {
        history =
            <div className="w-full py-2 flex items-center justify-center">
                <ClockLoader
                    color="#e2e8f0"
                    size={18}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                    speedMultiplier={1}
                />
                <span className="px-1">loading...</span>
            </div>
    }


    return (
        <div className={"w-full bg-gray-600 border-b border-slate-800" + (historyVisible ? '' : ' hidden')}>
            <div className="w-full bg-gray-900 flex flex-row">
                <div className="px-2 basis-1/6">
                    action
                </div>
                <div className="px-2 basis-1/6">
                    user
                </div>
                <div className="px-2 basis-1/6">
                    date
                </div>
                <div className="px-2 basis-2/6">
                    value
                </div>
                <div className="px-2 basis-1/6">
                    actions
                </div>
            </div>
            {history}
        </div>
    )
}

export default EntryFieldHistory