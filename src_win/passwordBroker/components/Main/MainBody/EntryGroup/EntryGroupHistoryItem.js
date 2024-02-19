import Moment from 'react-moment';
import React, {useContext, useState} from 'react';
import PasswordBrokerContext from '../../../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext';
import EntryGroupContext from '../../../../../../src_shared/passwordBroker/contexts/EntryGroupContext';
import {DataTable} from 'react-native-paper';
import tw from 'twrnc';
import {Text, View} from 'react-native-windows';

const EntryGroupHistoryItem = data => {
    const entryId = data.field.entry_id;
    const entryTitle = data.field.entry.title;

    const fieldId = data.field_id;
    const fieldTitle = data.field.title;
    const fieldType = data.field.type;
    const fieldEditLogId = data.field_edit_log_id;

    const [decryptedValue, setDecryptedValue] = useState('');
    const [decryptedValueVisible, setDecryptedValueVisible] = useState(false);
    const [buttonLoading, setButtonLoading] = useState('');
    const [historyVisible, setHistoryVisible] = useState(false);

    const passwordBrokerContext = useContext(PasswordBrokerContext);
    const {baseUrl, entryGroupId} = passwordBrokerContext;

    const entryGroupContext = useContext(EntryGroupContext);
    const {loadEntryFieldValueAndButtons} = entryGroupContext;

    const {value, buttons} = loadEntryFieldValueAndButtons(
        baseUrl +
            '/entryGroups/' +
            entryGroupId +
            '/entries/' +
            entryId +
            '/fields/' +
            fieldId +
            '/history/' +
            fieldEditLogId,
        {
            decryptedValue,
            setDecryptedValue,
            decryptedValueVisible,
            setDecryptedValueVisible,
            buttonLoading,
            setButtonLoading,
            historyVisible,
            setHistoryVisible,
        },
        data.field,
        true,
    );

    return (
        <View
            key={`${fieldId}-${fieldEditLogId}`}
            style={tw`flex flex-row bg-slate-700 px-2 py-0 border-t-2 border-slate-600`}>
            <View style={tw`basis-1/8 border-r-2 border-slate-600 py-2`}>
                <Text style={tw`text-slate-100 px-1`}>{entryTitle}</Text>
            </View>
            <View style={tw`basis-1/8 border-r-2 border-slate-600 py-2`}>
                <Text style={tw`text-slate-100 px-1`}>{fieldTitle}</Text>
            </View>
            <View style={tw`basis-1/8 border-r-2 border-slate-600 py-2`}>
                <Text style={tw`text-slate-100 px-1`}>{fieldType}</Text>
            </View>
            <View style={tw`basis-1/8 border-r-2 border-slate-600 py-2`}>
                <Text style={tw`text-slate-100 px-1`}>{data.event_type}</Text>
            </View>
            <View style={tw`basis-0.5/8 border-r-2 border-slate-600 py-2`}>
                <Text style={tw`text-slate-100 px-1`}>{data.user.name}</Text>
            </View>
            <View style={tw`basis-1/8 border-r-2 border-slate-600 py-2 text-center`}>
                <Moment element={Text} format="YYYY.MM.DD HH:mm" style={tw`text-center`}>
                    {data.created_at}
                </Moment>
            </View>
            <View style={tw`basis-1.5/8 text-slate-100 border-r-2 border-slate-600 py-2 px-1`}>{value}</View>
            <View style={tw`px-2 basis-1/8 flex justify-end py-1 flex flex-row px-1`}>{buttons}</View>
        </View>
    );
};

export default EntryGroupHistoryItem;
