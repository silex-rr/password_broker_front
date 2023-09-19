import React, {useState} from 'react';
import {ENTRY_GROUP_ENTRY_FIELDS_NOT_LOADED} from '../constants/EntryGroupEntryFieldsStatus';
import EntryContext from './EntryContext';

const EntryContextProvider = props => {
    const [entryFieldsStatus, setEntryFieldsStatus] = useState(ENTRY_GROUP_ENTRY_FIELDS_NOT_LOADED);
    const [entryFieldsData, setEntryFieldsData] = useState([]);
    const [entryFieldsIsVisible, setEntryFieldVisible] = useState(false);

    return (
        <EntryContext.Provider
            value={{
                entryFieldsStatus: entryFieldsStatus,
                setEntryFieldsStatus: setEntryFieldsStatus,
                entryFieldsData: entryFieldsData,
                setEntryFieldsData: setEntryFieldsData,
                entryFieldsIsVisible: entryFieldsIsVisible,
                setEntryFieldVisible: setEntryFieldVisible,
            }}>
            {props.children}
        </EntryContext.Provider>
    );
};

export default EntryContextProvider;
