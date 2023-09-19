import {Route, Routes} from 'react-router-native';
import PasswordBrokerContainer from '../components/PasswordBrokerContainer';
import React from 'react';
import AppContext from '../../AppContext';
import ModalOverlay from '../../common/ModalOverlay';
import Modal from '../../common/Modal';
import Link from '../components/Main/MainBody/EntryGroup/EntryFieldTypes/Link';
import Password from '../components/Main/MainBody/EntryGroup/EntryFieldTypes/Password';
import Note from '../components/Main/MainBody/EntryGroup/EntryFieldTypes/Note';
import File from '../components/Main/MainBody/EntryGroup/EntryFieldTypes/File';
import EntryFieldButton from '../components/Main/MainBody/EntryGroup/Entry/EntryFieldButton';
import PasswordBrokerContextProvider from '../../../src_shared/passwordBroker/contexts/PasswordBrokerContextProvider';
import EntryFieldContextProvider from '../../../src_shared/passwordBroker/contexts/EntryFieldContextProvider';
import EntryGroupContextProvider from '../../../src_shared/passwordBroker/contexts/EntryGroupContextProvider';

const PasswordBrokerRouter = () => {
    return (
        <PasswordBrokerContextProvider AppContext={AppContext}>
            <EntryGroupContextProvider
                entryFieldTypes={{
                    Link: Link,
                    Password: Password,
                    Note: Note,
                    File: File,
                }}
                EntryFieldButton={EntryFieldButton}
                copyToCliboard={() => {}}>
                <EntryFieldContextProvider>
                    <Routes>
                        <Route path="/entryGroup/:entryGroupId" element={<PasswordBrokerContainer />} />
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
