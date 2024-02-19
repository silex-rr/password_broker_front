import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import PasswordBrokerContext from '../../../../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext';
import {
    ENTRY_GROUP_ENTRY_FIELD_HISTORY_LOADED,
    ENTRY_GROUP_ENTRY_FIELD_HISTORY_LOADING,
    ENTRY_GROUP_ENTRY_FIELD_HISTORY_NOT_LOADED,
} from '../../../../../../../src_shared/passwordBroker/constants/EntryGroupEntryFieldHistoryStatus';
import EntryFieldHistoryItem from './EntryFieldHistoryItem';
import {ActivityIndicator, Text, View} from 'react-native-windows';
import tw from 'twrnc';

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

    let history = [];

    if (historyStatus === ENTRY_GROUP_ENTRY_FIELD_HISTORY_LOADED) {
        // console.log(historyData)
        for (let i = 0; i < historyData.length; i++) {
            history.push(
                <EntryFieldHistoryItem
                    key={historyData[i].field_edit_log_id}
                    data={historyData[i]}
                    fieldProps={fieldProps}
                />,
            );
        }
        // if (history.length === 0) {
        //     history = (
        //         <div style="flex w-full items-center justify-center py-2">
        //             <span style="px-1">history is empty</span>
        //         </div>
        //     );
        // }
    } else {
        // history = (
        //     <div style="flex w-full items-center justify-center py-2">
        //         <ClockLoader
        //             color="#e2e8f0"
        //             size={18}
        //             aria-label="Loading Spinner"
        //             data-testid="loader"
        //             speedMultiplier={1}
        //         />
        //         <span style="px-1">loading...</span>
        //     </div>
        // );
        history.push(
            <View key="empty_group_history" style={tw`py-3 flex flex-row bg-slate-700 justify-center`}>
                <View style={tw`px-2`}>
                    <ActivityIndicator size="small" color="#f1f5f9" />
                </View>
                <Text style={tw`text-slate-100`}>loading...</Text>
            </View>,
        );
    }

    return (
        <View style={tw`w-full border-b border-slate-800 bg-gray-600 ${historyVisible ? '' : ' hidden'}`}>
            <View style={tw`flex flex-row bg-gray-800`}>
                <View style={tw`basis-1/6 px-2`}>
                    <Text>action</Text>
                </View>
                <View style={tw`basis-1/6 px-2`}>
                    <Text>user</Text>
                </View>
                <View style={tw`basis-1/6 px-2`}>
                    <Text>date</Text>
                </View>
                <View style={tw`basis-2/6 px-2`}>
                    <Text>value</Text>
                </View>
                <View style={tw`basis-1/6 px-2`}>
                    <Text>actions</Text>
                </View>
            </View>
            {history}
        </View>
    );
};

export default EntryFieldHistory;
