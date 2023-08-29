import {Pressable, View} from "react-native-windows";
import tw from "twrnc";
import React, {useContext} from "react";
import EntryGroupAdd from "./EntryGroupAdd";
import {AppContext} from "../../../../../AppContext";
import {ENTRY_GROUP_ADDING_AWAIT} from "../../../../../../src_shared/passwordBroker/constants/EntryGroupAddingStates";
import {EntryGroupContext} from "../../../../../../src_shared/passwordBroker/contexts/EntryGroupContext";

const EntryGroupAddButton = (props) => {

    const {
        modalShow
    } = useContext(AppContext)

    const {
        setAddingEntryGroupState: setAddingEntryGroupState,
        setAddingEntryGroupTitle: setAddingEntryGroupTitle,
        setAddingEntryGroupErrorMessage: setAddingEntryGroupErrorMessage,
    } = useContext(EntryGroupContext)

    const openModal = () => {
        setAddingEntryGroupTitle('')
        setAddingEntryGroupErrorMessage('')
        setAddingEntryGroupState(ENTRY_GROUP_ADDING_AWAIT)
        modalShow(<EntryGroupAdd {...props}/>, {width: 700})
    }

    return (
        <View style={tw`px-2`}>
            <Pressable
                onPress={openModal}
            >
                {props.button}
            </Pressable>
        </View>
    )
}

export default EntryGroupAddButton