import {Route, Routes} from 'react-router-dom';
import PasswordBrokerContainer from '../components/PasswordBrokerContainer';
import Link from '../components/MainBody/EntryGroup/EntryFieldTypes/View/Link';
import Password from '../components/MainBody/EntryGroup/EntryFieldTypes/View/Password';
import Note from '../components/MainBody/EntryGroup/EntryFieldTypes/View/Note';
import File from '../components/MainBody/EntryGroup/EntryFieldTypes/View/File';
import EntryFieldButton from '../components/MainBody/EntryGroup/EntryFieldButton';
import AppContext from '../../AppContext';
import copy from 'copy-to-clipboard';
import React, {useContext} from 'react';
import PasswordBrokerContextProvider from '../../../src_shared/passwordBroker/contexts/PasswordBrokerContextProvider';
import EntryGroupContextProvider from '../../../src_shared/passwordBroker/contexts/EntryGroupContextProvider';

const PasswordBrokerRouter = () => {
    const {writeFile} = useContext(AppContext);
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
                copyToClipboard={copy}
                writeFile={writeFile}>
                <Routes>
                    <Route path="/entryGroup/:entryGroupId" element={<PasswordBrokerContainer />} />
                    <Route path="/" element={<PasswordBrokerContainer />} />
                </Routes>
            </EntryGroupContextProvider>
        </PasswordBrokerContextProvider>
    );
};

export default PasswordBrokerRouter;
