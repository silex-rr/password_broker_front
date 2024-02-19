import React, {useContext, useEffect, useState} from 'react';
import PasswordBrokerContext from '../../../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext';
import axios from 'axios';
import {
    ENTRY_GROUP_HISTORY_LOADED,
    ENTRY_GROUP_HISTORY_LOADING,
    ENTRY_GROUP_HISTORY_REQUIRED_LOADING,
} from '../../../../../../src_shared/passwordBroker/constants/EntryGroupHistoryStatus';
import EntryGroupHistoryItem from './EntryGroupHistoryItem';
import {ActivityIndicator, Text, View} from 'react-native-windows';
import tw from 'twrnc';

const EntryGroupHistory = () => {
    const passwordBrokerContext = useContext(PasswordBrokerContext);
    const {baseUrl, entryGroupId} = passwordBrokerContext;

    const [historyStatus, setHistoryStatus] = useState(ENTRY_GROUP_HISTORY_REQUIRED_LOADING);
    const [historyData, setHistoryData] = useState([]);

    useEffect(() => {
        if (historyStatus === ENTRY_GROUP_HISTORY_LOADED || historyStatus === ENTRY_GROUP_HISTORY_LOADING) {
            return;
        }
        setHistoryStatus(ENTRY_GROUP_HISTORY_LOADING);
        axios.get(baseUrl + '/entryGroups/' + entryGroupId + '/history').then(response => {
            setHistoryData(response.data);
            setHistoryStatus(ENTRY_GROUP_HISTORY_LOADED);
        });
    }, [baseUrl, entryGroupId, historyStatus, setHistoryStatus, setHistoryData]);

    const history = [];
    if (historyStatus === ENTRY_GROUP_HISTORY_LOADED) {
        for (let i = 0; i < historyData.length; i++) {
            history.push(<EntryGroupHistoryItem {...historyData[i]} />);
        }
    } else {
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
        <View style={tw`p-0`}>
            <View style={tw`flex flex-row p-2 bg-slate-900`}>
                <View style={tw`basis-1/8`}>
                    <Text style={tw`text-slate-200 text-center`}>Entry</Text>
                </View>
                <View style={tw`basis-1/8`}>
                    <Text style={tw`text-slate-200 text-center`}>Field title</Text>
                </View>
                <View style={tw`basis-1/8`}>
                    <Text style={tw`text-slate-200 text-center`}>Field type</Text>
                </View>
                <View style={tw`basis-1/8`}>
                    <Text style={tw`text-slate-200 text-center`}>Action</Text>
                </View>
                <View style={tw`basis-0.5/8`}>
                    <Text style={tw`text-slate-200 text-center`}>User</Text>
                </View>
                <View style={tw`basis-1/8`}>
                    <Text style={tw`text-slate-200 text-center`}>Date</Text>
                </View>
                <View style={tw`basis-1.5/8`}>
                    <Text style={tw`text-slate-200 text-center`}>Value</Text>
                </View>
                <View style={tw`basis-1/8`}>
                    <Text style={tw`text-slate-200 text-center`}>Actions</Text>
                </View>
            </View>
            <View style={tw`bg-slate-900 pb-1`}>{history}</View>
        </View>
    );
};

export default EntryGroupHistory;
