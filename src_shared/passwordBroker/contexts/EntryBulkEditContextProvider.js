import React, {useContext, useState} from 'react';
import EntryBulkEditContext from './EntryBulkEditContext';
import axios from 'axios';
import PasswordBrokerContext from './PasswordBrokerContext';
import {ENTRY_GROUP_REQUIRED_LOADING} from '../constants/EntryGroupStatus';
import GlobalContext from '../../common/contexts/GlobalContext';
import {MASTER_PASSWORD_INVALID, MASTER_PASSWORD_VALIDATED} from '../constants/MasterPasswordStates';

const EntryBulkEditContextProvider = props => {
    const [massSelectorChecked, setMassSelectorChecked] = useState(false);
    const [checkedEntries, setCheckedEntries] = useState([]);
    const {logActivityManual} = useContext(GlobalContext);
    const {
        baseUrl,
        entryGroupId,
        setEntryGroupStatus,
        masterPassword,
        setMasterPassword,
        setMasterPasswordState,
        setMasterPasswordCallback,
        showMasterPasswordModal,
    } = useContext(PasswordBrokerContext);

    const moveEntriesRequest = (targetGroup, masterPasswordForCheck) => {
        axios
            .post(`${baseUrl}/entryGroups/${entryGroupId}/entries/bulkEdit/move`, {
                entries: checkedEntries,
                entryGroupTarget: targetGroup.entry_group_id,
                master_password: masterPasswordForCheck,
            })
            .then(_ => {
                setEntryGroupStatus(ENTRY_GROUP_REQUIRED_LOADING);
                setMasterPasswordState(MASTER_PASSWORD_VALIDATED);
                setCheckedEntries([]);
                setMassSelectorChecked(false);
                logActivityManual('Entries moved to ' + targetGroup.title);
            })
            .catch(error => {
                if (
                    error.response?.data?.errors?.master_password ||
                    error.response?.data?.message === 'Unable to read key'
                ) {
                    setMasterPassword('');
                    setMasterPasswordState(MASTER_PASSWORD_INVALID);
                    setMasterPasswordCallback(() => masterPasswordForCheck => {
                        moveEntriesRequest(targetGroup, masterPasswordForCheck);
                    });
                    showMasterPasswordModal('MasterPassword is invalid');
                }
                logActivityManual('Something went wrong, try again');
                console.log(error ?? 'Something went wrong, try again');
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
                logActivityManual('Something went wrong, try again');
                console.log(error.message ?? 'Something went wrong, try again');
            });
    };

    const deleteEntries = () => {
        deleteEntriesRequest();
    };

    const moveEntries = targetGroup => {
        if (masterPassword === '') {
            setMasterPasswordCallback(() => masterPasswordForCheck => {
                moveEntriesRequest(targetGroup, masterPasswordForCheck);
            });
            showMasterPasswordModal();
        } else {
            moveEntriesRequest(targetGroup, masterPassword);
        }
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
