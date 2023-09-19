import React from 'react';
// import EntryFieldsAdd from "./EntryFieldsAdd";
import EntryField from './EntryField';
// import EntryFieldsEdit from "./EntryFieldsEdit";
import {Text, View} from 'react-native-windows';
// import {DataTable} from 'react-native-paper';
import tw from 'twrnc';
import EntryFieldAddButton from './EntryFieldAddButton';
//import PasswordBrokerContext from '../../../../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext';

const EntryFields = ({
    fields,
    entryGroupId,
    entryId,
    entryTitle,

    setEntryFieldsStatus,
}) => {
    const fieldComponents = [];

    for (let i = 0; i < fields.length; i++) {
        fieldComponents.push(EntryField(fields[i]));
    }

    return (
        <React.Fragment key={entryId + '_fields'}>
            <View style={tw`flex flex-row bg-slate-800`}>
                <Text style={tw`text-slate-100 font-bold px-2 basis-1/6`}>Title</Text>
                <Text style={tw`text-slate-100 font-bold px-2 basis-1/6`}>Type</Text>
                <Text style={tw`text-slate-100 font-bold px-2 basis-3/6`}>Value</Text>
                <Text style={tw`text-slate-100 font-bold px-2 basis-1/6`}>actions</Text>
            </View>

            {fieldComponents}

            <EntryFieldAddButton
                entryGroupId={entryGroupId}
                entryId={entryId}
                entryTitle={entryTitle}
                setEntryFieldsStatus={setEntryFieldsStatus}>
                <View style={tw`flex flex-row m-2`}>
                    <View style={tw`rounded py-2 px-10 bg-slate-800`}>
                        <Text style={tw`text-slate-200 text-center`}>add new Field</Text>
                    </View>
                </View>
            </EntryFieldAddButton>

            {/*<EntryFieldsEdit*/}
            {/*    entryGroupId={entryGroupId}*/}
            {/*    entryId={entryId}*/}
            {/*    entryTitle={props.entryTitle}*/}
            {/*    fields={props.fields}*/}
            {/*    setEntryFieldsStatus = {props.setEntryFieldsStatus}*/}
            {/*/>*/}

            {/*<EntryFieldsAdd*/}
            {/*    entryGroupId={entryGroupId}*/}
            {/*    entryId={entryId}*/}
            {/*    entryTitle={props.entryTitle}*/}
            {/*    setEntryFieldsStatus = {props.setEntryFieldsStatus}*/}
            {/*/>*/}
        </React.Fragment>
    );
};

export default EntryFields;
