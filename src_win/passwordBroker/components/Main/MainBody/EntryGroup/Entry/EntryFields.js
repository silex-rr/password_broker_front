import React from "react";
// import EntryFieldsAdd from "./EntryFieldsAdd";
import EntryField from "./EntryField";
// import EntryFieldsEdit from "./EntryFieldsEdit";
import {Text, View} from "react-native-windows";
import {DataTable} from "react-native-paper";
import tw from "twrnc";

const EntryFields = (props) => {
    const entryGroupId = props.entryGroupId
    const entryId = props.entryId
    const entryFieldsIsVisible = props.entryFieldsIsVisible

    const fields = []

    for (let i = 0; i < props.fields.length; i++) {
        fields.push(EntryField(props.fields[i]))
    }

    return (
        <React.Fragment key={entryId + '_fields'}>
            <View style={tw`flex flex-row bg-slate-800`}>
                <Text style={tw`text-slate-100 font-bold px-2 basis-1/6`}>Title</Text>
                <Text style={tw`text-slate-100 font-bold px-2 basis-1/6`}>Type</Text>
                <Text style={tw`text-slate-100 font-bold px-2 basis-3/6`}>Value</Text>
                <Text style={tw`text-slate-100 font-bold px-2 basis-1/6`}>actions</Text>
            </View>

            {fields}

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
    )
}

export default EntryFields