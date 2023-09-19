import {Pressable} from "react-native-windows";
import React, {useContext} from "react";
import {AppContext} from "../../../../../../AppContext";
import EntryFieldAdd from "./EntryFieldAdd";
import {EntryFieldContext} from "../../../../../../../src_shared/passwordBroker/contexts/EntryFieldContext";

const EntryFieldAddButton = ({
                                 entryGroupId,
                                 entryId,
                                 entryTitle,
                                 setEntryFieldsStatus,
                                 children
                             }) => {

    const {
        modalShow
    } = useContext(AppContext)

    const {
        beforeModalOpen,
    } = useContext(EntryFieldContext)

    const openModal = () => {
        beforeModalOpen()
        modalShow(
            <EntryFieldAdd
                entryGroupId={entryGroupId}
                entryId={entryId}
                entryTitle={entryTitle}
                setEntryFieldsStatus={setEntryFieldsStatus}

            />, {width: 700})
    }

    return (
        <Pressable
            onPress={openModal}
        >
            {children}
        </Pressable>
    )
}

export default EntryFieldAddButton