import React, {useContext, useState} from 'react';
import EntryBulkEditContext from './EntryBulkEditContext';
import axios from 'axios';
import PasswordBrokerContext from './PasswordBrokerContext';
import {ENTRY_GROUP_REQUIRED_LOADING} from '../constants/EntryGroupStatus';
import GlobalContext from '../../common/contexts/GlobalContext';

const EntryBulkEditContextProvider = props => {
    const [massSelectorChecked, setMassSelectorChecked] = useState(false);
    const [checkedEntries, setCheckedEntries] = useState([]);
    const {logActivityManual} = useContext(GlobalContext);
    const {baseUrl, entryGroupId, setEntryGroupStatus} = useContext(PasswordBrokerContext);

    const moveEntries = targetEntryGroupId => {
        axios
            .post(`${baseUrl}/entryGroups/${entryGroupId}/entries/bulkEdit/moveTo/${targetEntryGroupId}`, {
                entries: checkedEntries,
            })
            .then(_ => {
                setEntryGroupStatus(ENTRY_GROUP_REQUIRED_LOADING);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const deleteEntriesRequest = () => {
        axios
            .post(`${baseUrl}/entryGroups/${entryGroupId}/entries/bulkEdit/delete`, {
                entries: checkedEntries,
            })
            .then(_ => {
                setEntryGroupStatus(ENTRY_GROUP_REQUIRED_LOADING);
                setCheckedEntries([]);
                setMassSelectorChecked(false);
                logActivityManual('Entries deleted');
            })
            .catch(error => {
                console.log(error.message ?? 'Something went wrong, try again');
            });
    };

    const deleteEntries = () => {
        deleteEntriesRequest();
    };

    return (
        <EntryBulkEditContext.Provider
            value={{
                setMassSelectorChecked,
                massSelectorChecked,
                checkedEntries,
                setCheckedEntries,

                moveEntries,
                deleteEntries,
            }}>
            {props.children}
        </EntryBulkEditContext.Provider>
    );
};

export default EntryBulkEditContextProvider;
