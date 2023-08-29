import React, {useContext, useState} from "react";
import {PasswordBrokerContext} from "../../../../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext";
// import EntryFieldHistory from "./EntryFieldHistory";
import {EntryGroupContext} from "../../../../../../../src_shared/passwordBroker/contexts/EntryGroupContext";
import {Text, View} from "react-native-windows";
import {DataTable} from "react-native-paper";
import tw from "twrnc";

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

    const entryGroupContext = useContext(EntryGroupContext)
    const {
        loadEntryFieldValueAndButtons
    } = entryGroupContext

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
    )
//hover:bg-slate-600

    return (
        <View key={fieldId}>
            <View style={tw`flex flex-row w-full px-2 bg-slate-500 items-baseline ${(trashed ? 'hidden' : '')}`}>
                <View style={tw`px-2 basis-1/6`}>
                    <Text>{title}</Text>
                </View>
                <View style={tw`px-2 basis-1/6`}>
                    <Text>{type}</Text>
                </View>
                <View style={tw`basis-3/6`}>
                    {value}
                </View>
                <View style={tw`px-2 basis-1/6 flex justify-end py-1 flex flex-row`}>
                    {buttons}
                </View>
            </View>
            {/*<EntryFieldHistory*/}
            {/*    fieldProps={props}*/}
            {/*    historyVisible={historyVisible}*/}
            {/*/>*/}
        </View>
    )
}
export default EntryField