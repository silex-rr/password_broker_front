import React, {useContext, useState} from 'react';
import PasswordBrokerContext from '../../../../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext';
import EntryGroupContext from '../../../../../../../src_shared/passwordBroker/contexts/EntryGroupContext';
import {Text, View} from 'react-native-windows';
import tw from 'twrnc';
import EntryFieldHistory from './EntryFieldHistory';

const EntryField = props => {
    const fieldId = props.field_id;
    const entryId = props.entry_id;
    const type = props.type;
    const title = props.title;
    const entryGroupId = props.entry_group_id;
    const hideEdit = props.hideEdit;

    const [decryptedValue, setDecryptedValue] = useState('');
    const [decryptedValueVisible, setDecryptedValueVisible] = useState(false);
    const [buttonLoading, setButtonLoading] = useState('');
    const [historyVisible, setHistoryVisible] = useState(false);
    const [trashed, setTrashed] = useState(false);
    const [totpActivated, setTotpActivated] = useState(false);

    //,

    const passwordBrokerContext = useContext(PasswordBrokerContext);
    const {baseUrl} = passwordBrokerContext;

    const entryGroupContext = useContext(EntryGroupContext);
    const {loadEntryFieldValueAndButtons} = entryGroupContext;
    const {value, buttons} = loadEntryFieldValueAndButtons(
        baseUrl + '/entryGroups/' + entryGroupId + '/entries/' + entryId + '/fields/' + fieldId,
        {
            decryptedValue,
            setDecryptedValue,
            decryptedValueVisible,
            setDecryptedValueVisible,
            buttonLoading,
            setButtonLoading,
            historyVisible,
            setHistoryVisible,
            trashed,
            setTrashed,
            totpActivated,
            setTotpActivated,
        },
        props,
        hideEdit,
    );
    //hover:bg-slate-600
    return (
        <View>
            <View style={tw`flex flex-row w-full px-2 bg-slate-500 items-baseline ${trashed ? 'hidden' : ''}`}>
                <View style={tw`px-2 basis-1/6`}>
                    <Text>{title}</Text>
                </View>
                <View style={tw`px-2 basis-1/6`}>
                    <Text>{type}</Text>
                </View>
                <View style={tw`basis-2/6`}>{value}</View>
                <View style={tw`px-2 basis-2/6 flex justify-end py-1 flex flex-row flex-wrap`}>{buttons}</View>
            </View>
            <EntryFieldHistory fieldProps={props} historyVisible={historyVisible} />
        </View>
    );
};
export default EntryField;
