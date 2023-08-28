import Moment from "react-moment";
import axios from "axios";
import React, {useContext, useEffect} from "react";
import {PasswordBrokerContext} from "../../../../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext";
import {
    ENTRY_GROUP_ENTRY_FIELDS_LOADED,
    ENTRY_GROUP_ENTRY_FIELDS_LOADING,
    ENTRY_GROUP_ENTRY_FIELDS_NOT_LOADED,
    ENTRY_GROUP_ENTRY_FIELDS_REQUIRED_LOADING
} from "../../../../../../../src_shared/passwordBroker/constants/EntryGroupEntryFieldsStatus";
// import EntryFields from "./EntryFields";
import {EntryContext} from "../../../../../../../src_shared/passwordBroker/contexts/EntryContext";
import {Pressable, Text, View} from "react-native-windows";
import {DataTable} from "react-native-paper";
import tw from "twrnc";

const Entry = (props) => {

    const entryGroupId = props.entry_group_id
    const entryId = props.entry_id

    const passwordBrokerContext = useContext(PasswordBrokerContext)
    const {baseUrl} = passwordBrokerContext

    const entryContext = useContext(EntryContext)

    const {
        entryFieldsStatus,
        setEntryFieldsStatus,
        entryFieldsData,
        setEntryFieldsData,
        entryFieldsIsVisible,
        setEntryFieldVisible
    } = entryContext

    useEffect( () => {
        if (entryFieldsStatus === ENTRY_GROUP_ENTRY_FIELDS_REQUIRED_LOADING) {
            setEntryFieldsStatus(ENTRY_GROUP_ENTRY_FIELDS_LOADING)
            axios.get(baseUrl + '/entryGroups/' + entryGroupId + '/entries/' + entryId + '/fields').then(
                (response) => {
                    setEntryFieldsData(response.data)
                    setEntryFieldsStatus(ENTRY_GROUP_ENTRY_FIELDS_LOADED)
                }
            )
        }
    }, [entryFieldsStatus, baseUrl, entryGroupId, entryId, setEntryFieldsStatus, setEntryFieldsData]);


    const EntryFieldsVisibility = () => {
        if (entryFieldsStatus === ENTRY_GROUP_ENTRY_FIELDS_NOT_LOADED) {
            setEntryFieldsStatus(ENTRY_GROUP_ENTRY_FIELDS_REQUIRED_LOADING)
        }
        setEntryFieldVisible(!entryFieldsIsVisible)
    }

    let entryFields = <Text>''</Text>

    switch (entryFieldsStatus) {
        default:
            break

        case ENTRY_GROUP_ENTRY_FIELDS_LOADED:
            // entryFields = (
            //     <EntryFields
            //         fields={entryFieldsData}
            //         entryGroupId={entryGroupId}
            //         entryId={entryId}
            //         entryTitle={props.title}
            //         setEntryFieldsStatus = {setEntryFieldsStatus}
            //     />
            // )
            break
        case ENTRY_GROUP_ENTRY_FIELDS_REQUIRED_LOADING:
        case ENTRY_GROUP_ENTRY_FIELDS_LOADING:
        case ENTRY_GROUP_ENTRY_FIELDS_NOT_LOADED:
            entryFields = (<Text className="w-full text-center p-2 bg-slate-500">Loading...</Text>)
            break
    }


    //    borderStyle: 'solid',
    //     borderBottomWidth: StyleSheet.hairlineWidth,
    //     minHeight: 48,
    //     paddingHorizontal: 16,
    return (
        <React.Fragment>
            <DataTable.Row key={entryId + '_main'} style={{borderColor: '#191e24', paddingHorizontal: 0}}>
                <DataTable.Cell style={tw`bg-slate-700 pl-4`} onPress={EntryFieldsVisibility}>
                    <Text style={tw`text-slate-100`}>{props.title}</Text>
                </DataTable.Cell>
                <DataTable.Cell style={tw`bg-slate-700 pl-4`}>
                    <Moment element={Text} format="YYYY.MM.DD HH:mm" style={tw`text-slate-100`}>
                        {props.created_at}
                    </Moment>
                </DataTable.Cell>
                <DataTable.Cell style={tw`bg-slate-700 pl-4`}>
                    <Moment element={Text} format="YYYY.MM.DD HH:mm" style={tw`text-slate-100`}>
                        {props.updated_at}
                    </Moment>
                </DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row key={entryId + '_fields'} style={tw`${entryFieldsIsVisible ? '' : 'hidden'}`}>
                <View style={tw`bg-slate-700 text-slate-100 pt-0 px-0`}>
                    {entryFields}
                </View>
            </DataTable.Row>
        </React.Fragment>
    )
}


export default Entry