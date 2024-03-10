import RecoveryContext from './RecoveryContext';
import React, {useContext, useState} from 'react';
import IdentityContext from './IdentityContext';
import axios from 'axios';
import {
    RECOVERY_STATE_AWAIT,
    RECOVERY_STATE_DONE,
    RECOVERY_STATE_ERROR,
    RECOVERY_STATE_IN_PROCESS,
} from '../constants/RecoveryState';

const RecoveryContextProvider = ({children}) => {
    const [recoveryBackupFile, setRecoveryBackupFile] = useState(undefined);
    const [recoveryBackupPassword, setRecoveryBackupPassword] = useState(null);
    const [recoveryState, setRecoveryState] = useState(RECOVERY_STATE_AWAIT);
    const [recoveryError, setRecoveryError] = useState('');

    const {getUrlInitialRecovery} = useContext(IdentityContext);

    const recoveryRequest = () => {
        if (!(recoveryState === RECOVERY_STATE_AWAIT || recoveryState === RECOVERY_STATE_ERROR)) {
            return;
        }
        console.log(recoveryBackupFile);
        if (!recoveryBackupFile) {
            setRecoveryState(RECOVERY_STATE_ERROR);
            setRecoveryError('Please select a backup file');
            return;
        }

        setRecoveryState(RECOVERY_STATE_IN_PROCESS);
        const formData = new FormData();
        formData.append('backupFile', recoveryBackupFile);
        if (recoveryBackupPassword) {
            formData.append('password', recoveryBackupPassword);
        }
        axios
            .post(getUrlInitialRecovery(), formData)
            .then(response => {
                if (response.data.status === 'done') {
                    setRecoveryState(RECOVERY_STATE_DONE);
                    return;
                }
                setRecoveryState(RECOVERY_STATE_ERROR);
                setRecoveryError('Something going wrong try again');
            })
            .catch(error => {
                setRecoveryState(RECOVERY_STATE_ERROR);
                setRecoveryError(error?.response?.data?.message ?? error.message);
            });
    };

    return (
        <RecoveryContext.Provider
            value={{
                recoveryBackupFile,
                setRecoveryBackupFile,
                recoveryBackupPassword,
                setRecoveryBackupPassword,
                recoveryError,
                recoveryState,

                recoveryRequest,
            }}>
            {children}
        </RecoveryContext.Provider>
    );
};

export default RecoveryContextProvider;
