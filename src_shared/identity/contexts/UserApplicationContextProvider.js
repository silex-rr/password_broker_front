import UserApplicationContext from './UserApplicationContext';
import axios from 'axios';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
    OFFLINE_DATABASE_SYNC_MODE_AWAIT,
    OFFLINE_DATABASE_SYNC_MODE_DISABLE,
    OFFLINE_DATABASE_SYNC_MODE_ENABLE,
    OFFLINE_DATABASE_SYNC_MODE_ERROR,
    OFFLINE_DATABASE_SYNC_MODE_LOADING,
    OFFLINE_DATABASE_SYNC_MODE_UPDATING,
} from '../constants/OfflineDatabaseSyncModeStates';
import {
    APPLICATION_ERROR,
    APPLICATION_LOADED,
    APPLICATION_LOADING,
    APPLICATION_NOT_LOADED,
} from '../constants/ApplicationStates';
import {DATABASE_MODE_OFFLINE, DATABASE_MODE_ONLINE} from '../constants/DatabaseModeStates';
import {
    OFFLINE_DATABASE_DOWNLOAD_REQUIRED,
    OFFLINE_DATABASE_NOT_LOADED,
    OFFLINE_DATABASE_SYNCHRONIZED,
} from '../constants/OfflineDatabaseStatus';
import IdentityContext from './IdentityContext';

const UserApplicationContextProvider = props => {
    let hostURLDefault = '';

    const getClientId = props.getClientId
        ? props.getClientId
        : async () => {
              return '';
          };

    /**
     * @var {OfflineDatabaseService} offlineDatabaseService
     */
    const offlineDatabaseService = props.offlineDatabaseService;

    if (props.hostURL) {
        hostURLDefault = props.hostURL;
    } else if (process.env.REACT_APP_PASSWORD_BROKER_HOST) {
        hostURLDefault = process.env.REACT_APP_PASSWORD_BROKER_HOST;
    }

    /**
     * @var {AppToken} userAppToken
     */
    const {userAppToken} = useContext(IdentityContext);

    const defaultURL = hostURLDefault + '/identity/api';

    const [applicationId, setApplicationId] = useState('');
    const [applicationIdState, setApplicationIdState] = useState(APPLICATION_NOT_LOADED);
    const [offlineDatabaseSyncMode, setOfflineDatabaseSyncMode] = useState(OFFLINE_DATABASE_SYNC_MODE_AWAIT);
    const [databaseMode, setDatabaseMode] = useState(DATABASE_MODE_ONLINE);
    const [offlineDatabaseWorkerId, setOfflineDatabaseWorkerId] = useState(null);
    const [offlineDatabaseStatus, setOfflineDatabaseStatus] = useState(OFFLINE_DATABASE_NOT_LOADED);

    const offlineDatabaseUpdateWorker = useCallback(() => {
        if (offlineDatabaseWorkerId !== null) {
            return;
        }

        console.log('offlineDatabaseWorker', 'activated');

        const timeout = 5000;

        /**
         * @param {string} applicationIdForCheck
         */
        const checkIsOfflineDatabaseForUpdates = async applicationIdForCheck => {
            try {
                const response = await axios.get(
                    defaultURL + '/userApplication/' + applicationIdForCheck + '/isOfflineDatabaseRequiredUpdate',
                );
                return response.data.status;
            } catch (error) {
                console.log('checkOfflineDatabaseForUpdates', error);
                return false;
            }
        };

        /**
         * @param {AppToken} AppToken
         */
        const updateOfflineDatabase = async AppToken => {
            try {
                const response = await axios.get(hostURLDefault + '/passwordBroker/api/entryGroupsWithFields');
                await offlineDatabaseService.saveDatabaseByToken(AppToken, response.data.data, response.data.timestamp);
                return true;
            } catch (error) {
                console.log('updateOfflineDatabase', error);
                return false;
            }
        };

        const closure = async () => {
            console.log('offlineDatabaseWorker', 'closure iteration', offlineDatabaseStatus);
            switch (offlineDatabaseStatus) {
                default:
                    break;
                case OFFLINE_DATABASE_NOT_LOADED:
                    console.log(
                        'offlineDatabaseWorker',
                        'database start loading',
                        offlineDatabaseService.databaseStatus,
                    );
                    await offlineDatabaseService.loadDatabase(userAppToken.token);
                    console.log('offlineDatabaseWorker', 'database loaded', offlineDatabaseService.databaseStatus);
                    if (
                        [
                            offlineDatabaseService.constructor.STATUS_DOES_NOT_EXISTS,
                            offlineDatabaseService.constructor.STATUS_CORRUPTED,
                        ].includes(offlineDatabaseService.databaseStatus)
                    ) {
                        setOfflineDatabaseStatus(OFFLINE_DATABASE_DOWNLOAD_REQUIRED);
                    }
                    return;
                case OFFLINE_DATABASE_DOWNLOAD_REQUIRED:
                    if (await updateOfflineDatabase(userAppToken)) {
                        setOfflineDatabaseStatus(OFFLINE_DATABASE_SYNCHRONIZED);
                    }
                    break;
                case OFFLINE_DATABASE_SYNCHRONIZED:
                    if (await checkIsOfflineDatabaseForUpdates(applicationId)) {
                        setOfflineDatabaseStatus(OFFLINE_DATABASE_DOWNLOAD_REQUIRED);
                    }
                    break;
            }
            console.log('reactivated in ' + timeout, offlineDatabaseService.getDataBase());
            const timeoutId = setTimeout(closure, timeout);
            setOfflineDatabaseWorkerId(timeoutId);
        };

        closure().then(() => {});
    }, [
        applicationId,
        defaultURL,
        hostURLDefault,
        offlineDatabaseService,
        offlineDatabaseStatus,
        offlineDatabaseWorkerId,
        userAppToken,
    ]);

    /**
     * @param {AppToken} AppToken
     */
    const updateOfflineDatabaseKey = AppToken => {
        axios.get(defaultURL + '/getPrivateRsa').then(
            response => {
                offlineDatabaseService.saveKeyByToken(AppToken, response).then(
                    () => {
                        console.log('offline DB Key saved');
                    },
                    () => {
                        console.log('offline DB Key saving is failed');
                    },
                );
            },
            error => {
                console.log(error);
            },
        );
    };

    const loadUserApplication = () => {
        if (applicationIdState === APPLICATION_LOADING) {
            return;
        }
        setApplicationIdState(APPLICATION_LOADING);
        getClientId().then(clientId => {
            axios.post(defaultURL + '/userApplications', {clientId: clientId}).then(
                result => {
                    setApplicationId(result.data.userApplication.user_application_id);
                    setOfflineDatabaseSyncMode(
                        result.data.userApplication.is_offline_database_mode
                            ? OFFLINE_DATABASE_SYNC_MODE_ENABLE
                            : OFFLINE_DATABASE_SYNC_MODE_DISABLE,
                    );
                    setApplicationIdState(APPLICATION_LOADED);
                },
                error => {
                    console.log('createOrGetUserApplication', error);
                    setApplicationIdState(APPLICATION_ERROR);
                },
            );
        });
    };
    const getOfflineDatabaseSyncMode = () => {
        setOfflineDatabaseSyncMode(OFFLINE_DATABASE_SYNC_MODE_LOADING);
        axios.get(defaultURL + '/userApplication/' + applicationId + '/offlineDatabaseMode').then(
            result => {
                console.log(getOfflineDatabaseSyncMode, result.data.status);
                setOfflineDatabaseSyncMode(
                    result.data.status ? OFFLINE_DATABASE_SYNC_MODE_ENABLE : OFFLINE_DATABASE_SYNC_MODE_DISABLE,
                );
            },
            error => {
                console.log('getOfflineDatabaseMode', error);
                setOfflineDatabaseSyncMode(OFFLINE_DATABASE_SYNC_MODE_ERROR);
            },
        );
    };

    const switchDatabaseToOffline = () => {
        setDatabaseMode(DATABASE_MODE_OFFLINE);
    };

    const switchDatabaseToOnline = () => {
        setDatabaseMode(DATABASE_MODE_ONLINE);
    };

    const enableOfflineDatabaseSyncMode = () => {
        switchOfflineDatabaseSyncMode(true);
    };

    const disableOfflineDatabaseSyncMode = () => {
        switchOfflineDatabaseSyncMode(false);
    };
    const switchOfflineDatabaseSyncMode = (status = true) => {
        setOfflineDatabaseSyncMode(OFFLINE_DATABASE_SYNC_MODE_UPDATING);
        axios.put(defaultURL + '/userApplication/' + applicationId + '/offlineDatabaseMode', {status: status}).then(
            () => {
                setOfflineDatabaseSyncMode(
                    status ? OFFLINE_DATABASE_SYNC_MODE_ENABLE : OFFLINE_DATABASE_SYNC_MODE_DISABLE,
                );
            },
            error => {
                console.log('switchOfflineDatabaseMode', error);
                setOfflineDatabaseSyncMode(OFFLINE_DATABASE_SYNC_MODE_ERROR);
            },
        );
    };

    const reloadApplication = () => {
        setApplicationIdState(APPLICATION_NOT_LOADED);
    };

    useEffect(() => {
        if (offlineDatabaseSyncMode === OFFLINE_DATABASE_SYNC_MODE_ENABLE) {
            offlineDatabaseUpdateWorker();
        }

        return () => {
            if (offlineDatabaseWorkerId) {
                clearTimeout(offlineDatabaseWorkerId);
                setOfflineDatabaseWorkerId(null);
            }
        };
    }, [offlineDatabaseUpdateWorker, offlineDatabaseWorkerId, offlineDatabaseSyncMode, offlineDatabaseStatus]);

    return (
        <UserApplicationContext.Provider
            value={{
                applicationId,
                applicationIdState,
                offlineDatabaseSyncMode,
                databaseMode,

                loadUserApplication,
                getOfflineDatabaseSyncMode,
                enableOfflineDatabaseSyncMode,
                disableOfflineDatabaseSyncMode,
                reloadApplication,
                switchDatabaseToOffline,
                switchDatabaseToOnline,
                updateOfflineDatabaseKey,
            }}>
            {props.children}
        </UserApplicationContext.Provider>
    );
};

export default UserApplicationContextProvider;
