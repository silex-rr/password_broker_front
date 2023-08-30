import React, {useContext} from "react";
import {ENTRY_GROUP_ADDING_AWAIT} from "../../../../../../src_shared/passwordBroker/constants/EntryGroupAddingStates";
import {ActivityIndicator, Pressable, Text, TextInput, View} from "react-native-windows";
import tw from "twrnc";
import {AppContext} from "../../../../../AppContext";
import {EntryGroupContext} from "../../../../../../src_shared/passwordBroker/contexts/EntryGroupContext";

const EntryGroupAdd = (props) => {
    const {
        addNewEntryGroup: addNewEntryGroup,
        addingEntryGroupState: addingEntryGroupState,
        addingEntryGroupTitle: addingEntryGroupTitle,
        setAddingEntryGroupTitle: setAddingEntryGroupTitle,
        addingEntryGroupErrorMessage: addingEntryGroupErrorMessage,
    } = useContext(EntryGroupContext)

    const {
        modalClose
    } = useContext(AppContext)

    const entryGroupTitleParent = props.entryGroupTitle
    const entryGroupId = props.entryGroupId

    const changeTitle = (v) => {
        setAddingEntryGroupTitle(v)
    }

    let modalTitle = 'Adding new Entry Group'
    if (entryGroupId !== null) {
        modalTitle = "Adding new Entry Group to the Entry Group " + entryGroupTitleParent
    }

    // console.log(addingEntryGroupState, addingEntryGroupErrorMessage)

    return (
        <View>
            <View style={tw`w-full`}>
                <Text style={tw`text-lg font-bold`}>{modalTitle}</Text>

                <View style={tw`py-4 flex`}>
                    <View style={tw`flex flex-row py-1.5 items-center`}>
                        <Text style={tw`nline-block basis-1/3 text-lg`}>Entry Group Title:</Text>
                        <TextInput
                            value={addingEntryGroupTitle}
                            onChangeText={changeTitle}
                            placeholder={"type title for new field"}
                            style={tw`basis-2/3 bg-slate-800 text-slate-200 placeholder-slate-300`}
                        />
                    </View>

                    <View style={tw`flex flex-row justify-around w-full mt-12`}>
                        <Pressable onPress={() => addNewEntryGroup(entryGroupId)}
                                   style={{...tw`rounded py-2 px-10 w-1/3`, backgroundColor: '#36d399'}}>
                            <View>
                                {addingEntryGroupState === ENTRY_GROUP_ADDING_AWAIT
                                    ? <Text style={tw`text-slate-700 text-center w-full font-bold`}>ADD</Text>
                                    : <ActivityIndicator size="small" color="#e2e8f0" />
                                }
                            </View>
                        </Pressable>
                        <Pressable
                            onPress={modalClose} style={tw`rounded py-2 px-10 border border-red-400 w-1/3`}>
                            <Text
                                style={tw`text-red-400 text-center w-full`}
                            >CLOSE</Text>
                        </Pressable>
                    </View>
                     {addingEntryGroupErrorMessage === ''
                         ? ''
                         :
                         <View style={tw`flex w-full bg-red-700 text-slate-100 text-center mt-8 py-1.5`}>
                             <Text style={tw`text-slate-100 text-center`}>{addingEntryGroupErrorMessage}</Text>
                         </View>
                     }
                </View>
            </View>
        </View>
    )
}

export default EntryGroupAdd