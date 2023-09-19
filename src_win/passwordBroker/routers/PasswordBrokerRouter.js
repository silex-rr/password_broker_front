import {Route, Routes} from "react-router-native";
import PasswordBrokerContainer from "../components/PasswordBrokerContainer";
import {PasswordBrokerProvider} from "../../../src_shared/passwordBroker/contexts/PasswordBrokerContext";
import React from "react";
import {AppContext} from "../../AppContext";
import ModalOverlay from "../../common/ModalOverlay";
import Modal from "../../common/Modal";
import Link from "../components/Main/MainBody/EntryGroup/EntryFieldTypes/Link";
import Password from "../components/Main/MainBody/EntryGroup/EntryFieldTypes/Password";
import Note from "../components/Main/MainBody/EntryGroup/EntryFieldTypes/Note";
import File from "../components/Main/MainBody/EntryGroup/EntryFieldTypes/File";
import EntryFieldButton from "../components/Main/MainBody/EntryGroup/Entry/EntryFieldButton";
import {EntryGroupProvider} from "../../../src_shared/passwordBroker/contexts/EntryGroupContext";
import {EntryFieldProvider} from "../../../src_shared/passwordBroker/contexts/EntryFieldContext";

const PasswordBrokerRouter = () => {


    return (
        <PasswordBrokerProvider AppContext={AppContext}>
                <EntryGroupProvider
                    entryFieldTypes={{
                        Link: Link,
                        Password: Password,
                        Note: Note,
                        File: File
                    }}
                    EntryFieldButton={EntryFieldButton}
                    copyToCliboard={() => {}}
                >
                    <EntryFieldProvider>
                        <Routes>
                            <Route
                                path="/entryGroup/:entryGroupId"
                                element={
                                    <PasswordBrokerContainer/>
                                }
                            />
                            <Route
                                path="/"
                                element={
                                    <PasswordBrokerContainer/>
                                }
                            />
                        </Routes>
                        <ModalOverlay/>
                        <Modal/>
                    </EntryFieldProvider>
            </EntryGroupProvider>
        </PasswordBrokerProvider>
    )
}

export default PasswordBrokerRouter