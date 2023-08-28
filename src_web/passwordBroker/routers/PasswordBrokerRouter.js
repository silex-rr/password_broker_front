import {Route, Routes} from "react-router-dom";
import PasswordBrokerContainer from "../components/PasswordBrokerContainer";
import {PasswordBrokerProvider} from "../../../src_shared/passwordBroker/contexts/PasswordBrokerContext";
import Link from "../components/MainBody/EntryGroup/EntryFieldTypes/Link";
import Password from "../components/MainBody/EntryGroup/EntryFieldTypes/Password";
import Note from "../components/MainBody/EntryGroup/EntryFieldTypes/Note";
import File from "../components/MainBody/EntryGroup/EntryFieldTypes/File";
import EntryFieldButton from "../components/MainBody/EntryGroup/EntryFieldButton";
import {EntryGroupProvider} from "../../../src_shared/passwordBroker/contexts/EntryGroupContext";

const PasswordBrokerRouter = () => {
    return (
        <PasswordBrokerProvider>
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
            </EntryGroupProvider>
        </PasswordBrokerProvider>
    )
}

export default PasswordBrokerRouter