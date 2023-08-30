import Entry from "./Entry/Entry";
// import EntryAdd from "./EntryAdd";
import {ROLE_CAN_EDIT} from "../../../../../../src_shared/passwordBroker/constants/EntryGroupRole";
import React, {useContext} from "react";
import {PasswordBrokerContext} from "../../../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext";
import {Pressable, Text, View} from "react-native-windows";
import {DataTable} from "react-native-paper";
import tw from "twrnc";
import {EntryProvider} from "../../../../../../src_shared/passwordBroker/contexts/EntryContext";
import EntryGroupAddButton from "./EntryGroupAddButton";

const EntryGroup = (props) => {
    const passwordBrokerContext = useContext(PasswordBrokerContext)
    const {
        entryGroupId
    } = passwordBrokerContext

    const entries = []
    for (let i = 0; i < props.entries.length; i++) {
        entries.push(
            <EntryProvider key={props.entries[i].entry_id}>
                <Entry {...props.entries[i]} />
            </EntryProvider>
        )
    }
    if (entries.length === 0) {
        entries.push(<DataTable.Row key="empty_group"><Text>there are no entries</Text></DataTable.Row>)
    }

    // const entryGroupAddButton =

    return (
        <View style={tw`overflow-x-auto`}>
            <DataTable style={tw`w-full`}>
                <DataTable.Header style={{borderColor: '#191e24', paddingHorizontal: 0}}>
                    <DataTable.Title style={tw`bg-slate-900 pl-4`}>
                        <Text style={tw`text-slate-200`}>Entry title</Text>
                    </DataTable.Title>
                    <DataTable.Title style={tw`bg-slate-900 pl-4`}>
                        <Text style={tw`text-slate-200`}>Created at</Text>
                    </DataTable.Title>
                    <DataTable.Title style={tw`bg-slate-900 pl-4`}>
                        <Text style={tw`text-slate-200`}>Updated at</Text>
                    </DataTable.Title>
                </DataTable.Header>
                {entries}
            </DataTable>
            {ROLE_CAN_EDIT.includes(props.role.role)
                ?
                    <View style={tw`py-3 flex flex-row`}>
                        {/*<EntryGroupAdd*/}
                        {/*    entryGroupTitle = {props.entryGroup.name}*/}
                        {/*/>*/}

                        <EntryGroupAddButton
                            entryGroupId = {entryGroupId}
                            entryGroupTitle = {props.entryGroup.name}
                            button ={
                                <View style={tw`rounded py-2 px-10 bg-slate-800`}>
                                    <Text
                                        style={tw`text-slate-200 text-center`}
                                    >add new child Entry Group</Text>
                                </View>
                            }
                        />
                    </View>
                : ''
            }

        </View>
    )
}
//                 <EntryGroupAddButton
//                      entryGroupId = {null}
//                      entryGroupTitle = {null}
//                      button = {
//                          <MaterialCommunityIcons name='folder-plus' size={32} color='#1e293b'/>
//                      }
//                  />

export default EntryGroup