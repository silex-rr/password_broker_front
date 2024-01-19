import {Route, Routes} from 'react-router-native';
import PasswordBrokerContainer from '../components/PasswordBrokerContainer';
import React, {useContext} from 'react';
import AppContext from '../../AppContext';
import ModalOverlay from '../../common/ModalOverlay';
import Modal from '../../common/Modal';
import Link from '../components/Main/MainBody/EntryGroup/Entry/EntryFieldTypes/View/Link';
import Password from '../components/Main/MainBody/EntryGroup/Entry/EntryFieldTypes/View/Password';
import Note from '../components/Main/MainBody/EntryGroup/Entry/EntryFieldTypes/View/Note';
import File from '../components/Main/MainBody/EntryGroup/Entry/EntryFieldTypes/View/File';
import EntryFieldButton from '../components/Main/MainBody/EntryGroup/Entry/EntryFieldButton';
import PasswordBrokerContextProvider from '../../../src_shared/passwordBroker/contexts/PasswordBrokerContextProvider';
import EntryFieldContextProvider from '../../../src_shared/passwordBroker/contexts/EntryFieldContextProvider';
import EntryGroupContextProvider from '../../../src_shared/passwordBroker/contexts/EntryGroupContextProvider';
import UserApplicationContext from '../../../src_shared/identity/contexts/UserApplicationContext';
import PasswordBrokerSearchContainer from '../components/PasswordBrokerSearchContainer';

const PasswordBrokerRouter = () => {
    const {copyToClipboard, writeFile, offlineDatabaseService} = useContext(AppContext);
    return (
        <PasswordBrokerContextProvider
            AppContext={AppContext}
            UserApplicationContext={UserApplicationContext}
            offlineDatabaseService={offlineDatabaseService}>
            <EntryGroupContextProvider
                entryFieldTypes={{
                    Link: Link,
                    Password: Password,
                    Note: Note,
                    File: File,
                }}
                EntryFieldButton={EntryFieldButton}
                copyToClipboard={copyToClipboard}
                writeFile={writeFile}>
                <EntryFieldContextProvider>
                    <Routes>
                        <Route path="/entryGroup/:entryGroupId" element={<PasswordBrokerContainer />} />
                        <Route path="/entrySearch/:searchQuery" element={<PasswordBrokerSearchContainer />} />
                        <Route path="/" element={<PasswordBrokerContainer />} />
                    </Routes>
                    <ModalOverlay />
                    <Modal />
                </EntryFieldContextProvider>
            </EntryGroupContextProvider>
        </PasswordBrokerContextProvider>
    );
};

export default PasswordBrokerRouter;
