import React, {useContext, useState} from 'react';
import Moment from 'react-moment';
import PasswordBrokerContext from '../../../../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext';
import EntryGroupContext from '../../../../../../../src_shared/passwordBroker/contexts/EntryGroupContext';
import {Text, View} from 'react-native-windows';
import tw from 'twrnc';

const EntryFieldHistoryItem = ({fieldProps, data}) => {
    const entryId = fieldProps.entry_id;
    const fieldId = data.field_id;
    const fieldEditLogId = data.field_edit_log_id;

    const [decryptedValue, setDecryptedValue] = useState('');
    const [decryptedValueVisible, setDecryptedValueVisible] = useState(false);
    const [buttonLoading, setButtonLoading] = useState('');
    const [historyVisible, setHistoryVisible] = useState(false);
    const [totpActivated, setTotpActivated] = useState(false);

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
            totpActivated,
            setTotpActivated,
        },
        fieldProps,
        true,
    );

    return (
        <View key={fieldEditLogId} style={tw`flex flex-row px-2 py-0 border-t border-slate-500 bg-gray-600`}>
            <View style={tw`basis-1/6 border-r-2 border-slate-600 py-2`}>
                <Text style={tw`text-slate-100 px-1`}>{data.event_type}</Text>
            </View>
            <View style={tw`basis-1/6 border-r-2 border-slate-600 py-2`}>
                <Text style={tw`text-slate-100 px-1`}>{data.user.name}</Text>
            </View>
            <View style={tw`basis-1/6 border-r-2 border-slate-600 py-2 text-center`}>
                <Moment element={Text} format="YYYY.MM.DD HH:mm" style={tw``}>
                    {data.created_at}
                </Moment>
            </View>
            <View style={tw`basis-2/6 text-slate-100 border-r-2 border-slate-600 py-2 px-1`}>{value}</View>
            <View style={tw`px-2 basis-1/6 flex justify-end py-1 flex flex-row px-1`}>{buttons}</View>
        </View>
    );
};

export default EntryFieldHistoryItem;
