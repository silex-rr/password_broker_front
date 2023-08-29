import {Route, Routes} from "react-router-native";
import PasswordBrokerContainer from "../components/PasswordBrokerContainer";
import {PasswordBrokerProvider} from "../../../src_shared/passwordBroker/contexts/PasswordBrokerContext";
import React, {useContext} from "react";
import {AppContext} from "../../AppContext";
import ModalOverlay from "../../common/ModalOverlay";
import Modal from "../../common/Modal";
import Link from "../components/Main/MainBody/EntryGroup/EntryFieldTypes/Link";
import Password from "../components/Main/MainBody/EntryGroup/EntryFieldTypes/Password";
import Note from "../components/Main/MainBody/EntryGroup/EntryFieldTypes/Note";
import File from "../components/Main/MainBody/EntryGroup/EntryFieldTypes/File";
import EntryFieldButton from "../components/Main/MainBody/EntryGroup/Entry/EntryFieldButton";
import {EntryGroupProvider} from "../../../src_shared/passwordBroker/contexts/EntryGroupContext";

const PasswordBrokerRouter = () => {

    const {
        hostURL
    } = useContext(AppContext)

    return (
        <PasswordBrokerProvider hostURL={hostURL}>
                <EntryGroupProvider
                    entryFieldTypes={{
                        Link: Link,
                        Password: Password,
                        Note: Note,
                        File: File
                    }}
                    EntryFieldButton={EntryFieldButton}
                >
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
            </EntryGroupProvider>
        </PasswordBrokerProvider>
    )
}

export default PasswordBrokerRouter