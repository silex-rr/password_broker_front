import React, {useContext, useEffect, useState} from 'react';
import {ClockLoader} from 'react-spinners';
import axios from 'axios';
import PasswordBrokerContext from '../../../../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext';
import {
    ENTRY_GROUP_ENTRY_FIELD_HISTORY_LOADED,
    ENTRY_GROUP_ENTRY_FIELD_HISTORY_LOADING,
    ENTRY_GROUP_ENTRY_FIELD_HISTORY_NOT_LOADED,
} from '../../../../../../../src_shared/passwordBroker/constants/EntryGroupEntryFieldHistoryStatus';
import EntryFieldHistoryItem from './../../EntryFieldHistoryItem';

const EntryFieldHistory = ({fieldProps, historyVisible}) => {
    const fieldId = fieldProps.field_id;
    const entryId = fieldProps.entry_id;

    const passwordBrokerContext = useContext(PasswordBrokerContext);
    const {baseUrl, entryGroupId} = passwordBrokerContext;

    const [historyStatus, setHistoryStatus] = useState(ENTRY_GROUP_ENTRY_FIELD_HISTORY_NOT_LOADED);
    const [historyData, setHistoryData] = useState([]);

    useEffect(() => {
        if (
            !historyVisible ||
            historyStatus === ENTRY_GROUP_ENTRY_FIELD_HISTORY_LOADED ||
            historyStatus === ENTRY_GROUP_ENTRY_FIELD_HISTORY_LOADING
        ) {
            return;
        }
        setHistoryStatus(ENTRY_GROUP_ENTRY_FIELD_HISTORY_LOADING);
        axios
            .get(baseUrl + '/entryGroups/' + entryGroupId + '/entries/' + entryId + '/fields/' + fieldId + '/history')
            .then(response => {
                setHistoryData(response.data);
                setHistoryStatus(ENTRY_GROUP_ENTRY_FIELD_HISTORY_LOADED);
            });
    }, [baseUrl, entryGroupId, entryId, fieldId, historyVisible, historyStatus, setHistoryStatus, setHistoryData]);

    let history;

    if (historyStatus === ENTRY_GROUP_ENTRY_FIELD_HISTORY_LOADED) {
        // console.log(historyData)
        history = [];
        for (let i = 0; i < historyData.length; i++) {
            history.push(
                <EntryFieldHistoryItem
                    key={historyData[i].field_edit_log_id}
                    data={historyData[i]}
                    fieldProps={fieldProps}
                />,
            );
        }
        if (history.length === 0) {
            history = (
                <div className="flex w-full items-center justify-center py-2">
                    <span className="px-1">history is empty</span>
                </div>
            );
        }
    } else {
        history = (
            <div className="flex w-full items-center justify-center py-2">
                <ClockLoader
                    color="#e2e8f0"
                    size={18}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                    speedMultiplier={1}
                />
                <span className="px-1">loading...</span>
            </div>
        );
    }

    return (
        <div className={'w-full border-b border-slate-800 bg-gray-600' + (historyVisible ? '' : ' hidden')}>
            <div className="flex w-full flex-row bg-gray-900">
                <div className="basis-1/6 px-2">action</div>
                <div className="basis-1/6 px-2">user</div>
                <div className="basis-1/6 px-2">date</div>
                <div className="basis-2/6 px-2">value</div>
                <div className="basis-1/6 px-2">actions</div>
            </div>
            {history}
        </div>
    );
};

export default EntryFieldHistory;
