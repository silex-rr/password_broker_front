import React, {useContext, useEffect, useState} from "react";
import {PasswordBrokerContext} from "../../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext";
import axios from "axios";
import {
    ENTRY_GROUP_HISTORY_LOADED,
    ENTRY_GROUP_HISTORY_LOADING,
    ENTRY_GROUP_HISTORY_REQUIRED_LOADING
} from "../../../../../src_shared/passwordBroker/constants/EntryGroupHistoryStatus";
import EntryGroupHistoryItem from "./EntryGroupHistoryItem";
import {ClockLoader} from "react-spinners";

const EntryGroupHistory = () => {
    const passwordBrokerContext = useContext(PasswordBrokerContext)
    const {
        baseUrl,
        entryGroupId
    } = passwordBrokerContext

    const [historyStatus, setHistoryStatus] = useState(ENTRY_GROUP_HISTORY_REQUIRED_LOADING)
    const [historyData, setHistoryData] = useState([])

    useEffect(() => {
        if (historyStatus === ENTRY_GROUP_HISTORY_LOADED
            || historyStatus === ENTRY_GROUP_HISTORY_LOADING
        ) {
            return
        }
        setHistoryStatus(ENTRY_GROUP_HISTORY_LOADING)
        axios.get(baseUrl + '/entryGroups/' + entryGroupId + '/history')
            .then((response) => {
                setHistoryData(response.data)
                setHistoryStatus(ENTRY_GROUP_HISTORY_LOADED)
            })

    }, [baseUrl, entryGroupId, historyStatus, setHistoryStatus, setHistoryData]);

    const history = []
    if (historyStatus === ENTRY_GROUP_HISTORY_LOADED) {
        for (let i = 0; i < historyData.length; i++) {
            history.push(<EntryGroupHistoryItem {...historyData[i]} />)
        }
    } else {
        history.push(
            <tr key="empty_group_history">
                <td colSpan="100%" className="bg-slate-700 text-slate-100 text-center">
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
                </td>
            </tr>)
    }

    return (
        <div className="">
            <table className="table w-full table-compact">
                <thead>
                <tr>
                    <th className="bg-slate-900 text-slate-200">Entry</th>
                    <th className="bg-slate-900 text-slate-200">Field title</th>
                    <th className="bg-slate-900 text-slate-200">Field type</th>
                    <th className="bg-slate-900 text-slate-200">Action</th>
                    <th className="bg-slate-900 text-slate-200">User</th>
                    <th className="bg-slate-900 text-slate-200">Date</th>
                    <th className="bg-slate-900 text-slate-200">Value</th>
                    <th className="bg-slate-900 text-slate-200">Actions</th>
                </tr>
                </thead>
                <tbody>
                    {history}
                </tbody>
            </table>
        </div>
    )
}

export default EntryGroupHistory