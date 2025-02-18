import React, {useContext, useState} from 'react';
import EntryBulkEditContext from './EntryBulkEditContext';
import axios from 'axios';
import PasswordBrokerContext from './PasswordBrokerContext';
import {ENTRY_GROUP_REQUIRED_LOADING} from '../constants/EntryGroupStatus';

const EntryBulkEditContextProvider = props => {
    const [massSelectorChecked, setMassSelectorChecked] = useState(false);
    const [checkedEntries, setCheckedEntries] = useState([]);
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

    const deleteEntries = () => {
        axios
            .post(`${baseUrl}/entryGroups/${entryGroupId}/entries/bulkEdit/delete`, {
                entries: checkedEntries,
            })
            .then(_ => {
                setEntryGroupStatus(ENTRY_GROUP_REQUIRED_LOADING);
            })
            .catch(error => {
                console.log(error);
            });
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
