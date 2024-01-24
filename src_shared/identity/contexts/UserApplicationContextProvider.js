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
import {
    DATABASE_MODE_OFFLINE,
    DATABASE_MODE_ONLINE,
    DATABASE_MODE_SWITCHING_TO_OFFLINE,
} from '../constants/DatabaseModeStates';
import {
    OFFLINE_DATABASE_DOWNLOAD_REQUIRED,
    OFFLINE_DATABASE_IS_UPDATING,
    OFFLINE_DATABASE_NOT_LOADED,
    OFFLINE_DATABASE_SYNCHRONIZED,
} from '../constants/OfflineDatabaseStatus';
import IdentityContext from './IdentityContext';
// import {Buffer} from 'buffer';
const Buffer = require('buffer/').Buffer;
const UserApplicationContextProvider = props => {
    const getClientId = props.getClientId
        ? props.getClientId
        : async () => {
              return '';
          };

    /**
     * @var {OfflineDatabaseService} offlineDatabaseService
     */
    const offlineDatabaseService = props.offlineDatabaseService;

    const identityContext = useContext(IdentityContext);
    const {hostURL} = identityContext;

    /**
     * @var {AppToken} userAppToken
     */
    const {userAppToken} = identityContext;

    const defaultURL = hostURL + '/identity/api';

    const [applicationId, setApplicationId] = useState('');
    const [applicationIdState, setApplicationIdState] = useState(APPLICATION_NOT_LOADED);
    const [offlineDatabaseSyncMode, setOfflineDatabaseSyncMode] = useState(OFFLINE_DATABASE_SYNC_MODE_AWAIT);
    const [databaseMode, setDatabaseMode] = useState(DATABASE_MODE_ONLINE);

    const [offlineDatabaseWorkerId, setOfflineDatabaseWorkerId] = useState(null);
    const [offlineDatabaseStatus, setOfflineDatabaseStatus] = useState(OFFLINE_DATABASE_NOT_LOADED);

    const [offlinePrivateKeyWorkerId, setOfflinePrivateKeyWorkerId] = useState(null);
    const [offlinePrivateKeyStatus, setOfflinePrivateKeyStatus] = useState(OFFLINE_DATABASE_NOT_LOADED);
    const [offlineSaltStatus, setOfflineSaltStatus] = useState(OFFLINE_DATABASE_NOT_LOADED);

    const iconDisableColor = '#777777';

    const userApplicationUnload = useCallback(
        () => {
            setApplicationId(applicationId);
            setApplicationIdState(applicationIdState);
            setOfflineDatabaseSyncMode(offlineDatabaseSyncMode);
            setDatabaseMode(databaseMode);

            setOfflineDatabaseWorkerId(offlineDatabaseWorkerId);
            setOfflineDatabaseStatus(offlineDatabaseStatus);

            setOfflinePrivateKeyWorkerId(offlinePrivateKeyWorkerId);
            setOfflinePrivateKeyStatus(offlinePrivateKeyStatus);
            setOfflineSaltStatus(offlineSaltStatus);
        },
        //Dependency avoided intentionally to put all state on default
        [],
    );

    const offlinePrivateKeyUpdateWorker = useCallback(() => {
        if (offlinePrivateKeyWorkerId !== null) {
            return;
        }

        // console.log('offlinePrivateKeyUpdateWorker', 'activated');

        const timeout = 30000;

        /**
         * @param {string} applicationIdForCheck
         */
        const checkIsOfflinePrivateKeyForUpdatesAwait = async applicationIdForCheck => {
            try {
                const response = await axios.get(
                    defaultURL + '/userApplication/' + applicationIdForCheck + '/isRsaPrivateRequiredUpdate',
                );
                return response.data.status;
            } catch (error) {
                console.log('checkIsOfflineDatabaseForUpdatesAwait', error);
                return false;
            }
        };

        /**
         * @param {AppToken} AppToken
         */
        const updateOfflinePrivateKeyAwait = async AppToken => {
            try {
                const response = await axios.get(defaultURL + '/getPrivateRsa');
                const decodedKey = Buffer.from(response.data.rsa_private_key_base64, 'base64').toString('binary');
                await offlineDatabaseService.saveKeyByToken(AppToken, decodedKey, response.data.timestamp);
                // if (databaseMode === DATABASE_MODE_OFFLINE) {
                await offlineDatabaseService.reloadKey();
                console.log(
                    'offlineDatabaseService.getKey()',
                    offlineDatabaseService.getKey(),
                    offlineDatabaseService.keyStatus,
                );
                // }
                return true;
            } catch (error) {
                console.log('updateOfflinePrivateKeyAwait', error);
                return false;
            }
        };

        const closure = async () => {
            switch (offlinePrivateKeyStatus) {
                default:
                    break;
                case OFFLINE_DATABASE_NOT_LOADED:
                    await offlineDatabaseService.loadKeyByToken(userAppToken);
                    if (
                        [
                            offlineDatabaseService.constructor.STATUS_DOES_NOT_EXISTS,
                            offlineDatabaseService.constructor.STATUS_CORRUPTED,
                        ].includes(offlineDatabaseService.keyStatus)
                    ) {
                        setOfflinePrivateKeyStatus(OFFLINE_DATABASE_DOWNLOAD_REQUIRED);
                        return;
                    }
                    if (offlineDatabaseService.keyStatus === offlineDatabaseService.constructor.STATUS_LOADED) {
                        setOfflinePrivateKeyStatus(OFFLINE_DATABASE_SYNCHRONIZED);
                        return;
                    }
                    break;
                case OFFLINE_DATABASE_DOWNLOAD_REQUIRED:
                    if (await updateOfflinePrivateKeyAwait(userAppToken)) {
                        setOfflinePrivateKeyStatus(OFFLINE_DATABASE_SYNCHRONIZED);
                        return;
                    }
                    break;
                case OFFLINE_DATABASE_SYNCHRONIZED:
                    if (await checkIsOfflinePrivateKeyForUpdatesAwait(applicationId)) {
                        setOfflinePrivateKeyStatus(OFFLINE_DATABASE_DOWNLOAD_REQUIRED);
                        return;
                    }
                    break;
            }
            const timeoutId = setTimeout(closure, timeout);
            setOfflinePrivateKeyWorkerId(timeoutId);
        };

        closure().then(() => {});
    }, [
        offlinePrivateKeyWorkerId,
        defaultURL,
        offlineDatabaseService,
        offlinePrivateKeyStatus,
        userAppToken,
        applicationId,
    ]);

    const offlineDatabaseUpdateWorker = useCallback(() => {
        if (offlineDatabaseWorkerId !== null) {
            return;
        }

        const timeout = 5000;

        /**
         * @param {string} applicationIdForCheck
         */
        const checkIsOfflineDatabaseForUpdatesAwait = async applicationIdForCheck => {
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
        const updateOfflineDatabaseAwait = async AppToken => {
            try {
                const response = await axios.get(hostURL + '/passwordBroker/api/entryGroupsWithFields');
                await offlineDatabaseService.saveDatabaseByToken(AppToken, response.data.data, response.data.timestamp);
                if (databaseMode === DATABASE_MODE_OFFLINE) {
                    await offlineDatabaseService.reloadDatabase();
                }
                return true;
            } catch (error) {
                console.log('updateOfflineDatabase', error);
                return false;
            }
        };

        const closure = async () => {
            // console.log('offlineDatabaseWorker', 'closure iteration', offlineDatabaseStatus);
            switch (offlineDatabaseStatus) {
                default:
                    break;
                case OFFLINE_DATABASE_NOT_LOADED:
                    await offlineDatabaseService.loadDataBaseByToken(userAppToken);
                    if (
                        [
                            offlineDatabaseService.constructor.STATUS_DOES_NOT_EXISTS,
                            offlineDatabaseService.constructor.STATUS_CORRUPTED,
                        ].includes(offlineDatabaseService.databaseStatus)
                    ) {
                        setOfflineDatabaseStatus(OFFLINE_DATABASE_DOWNLOAD_REQUIRED);
                        return;
                    }
                    if (offlineDatabaseService.databaseStatus === offlineDatabaseService.constructor.STATUS_LOADED) {
                        setOfflineDatabaseStatus(OFFLINE_DATABASE_SYNCHRONIZED);
                        return;
                    }
                    break;
                case OFFLINE_DATABASE_DOWNLOAD_REQUIRED:
                    if (await updateOfflineDatabaseAwait(userAppToken)) {
                        setOfflineDatabaseStatus(OFFLINE_DATABASE_SYNCHRONIZED);
                        return;
                    }
                    break;
                case OFFLINE_DATABASE_SYNCHRONIZED:
                    if (await checkIsOfflineDatabaseForUpdatesAwait(applicationId)) {
                        setOfflineDatabaseStatus(OFFLINE_DATABASE_DOWNLOAD_REQUIRED);
                        return;
                    }
                    break;
            }
            const timeoutId = setTimeout(closure, timeout);
            setOfflineDatabaseWorkerId(timeoutId);
        };

        closure().then(() => {});
    }, [
        applicationId,
        databaseMode,
        defaultURL,
        hostURL,
        offlineDatabaseService,
        offlineDatabaseStatus,
        offlineDatabaseWorkerId,
        userAppToken,
    ]);

    /**
     * @param {AppToken} AppToken
     */
    const updateOfflineDatabase = AppToken => {
        axios.get(hostURL + '/passwordBroker/api/entryGroupsWithFields').then(
            response => {
                offlineDatabaseService.saveDatabaseByToken(AppToken, response.data.data, response.data.timestamp).then(
                    () => {
                        console.log('offline DB saved');
                    },
                    error => {
                        console.log('offline DB saving is failed', error);
                    },
                );
            },
            error => {
                console.log(error);
            },
        );
    };

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
                // console.log('getOfflineDatabaseSyncMode', result.data.status);
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
        setDatabaseMode(DATABASE_MODE_SWITCHING_TO_OFFLINE);
        offlineDatabaseService.loadDataBaseWithKeyAndSaltByToken(userAppToken).then(
            () => setDatabaseMode(DATABASE_MODE_OFFLINE),
            error => console.log('switchDatabaseToOffline Error:', error),
        );
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

    const updateOfflineSalt = useCallback(
        AppToken => {
            console.log('updateOfflineSalt');
            offlineDatabaseService.loadSaltByToken(AppToken).then(() => {
                console.log(
                    'updateOfflineSalt saltStatus',
                    offlineDatabaseService.saltStatus,
                    offlineDatabaseService.salt,
                );
                if (
                    offlineDatabaseService.saltStatus === offlineDatabaseService.constructor.STATUS_LOADED ||
                    offlineSaltStatus !== OFFLINE_DATABASE_NOT_LOADED
                ) {
                    return;
                }
                setOfflineSaltStatus(OFFLINE_DATABASE_IS_UPDATING);
                console.log('updateOfflineSalt updating');
                axios.get(defaultURL + '/getCbcSalt').then(
                    response => {
                        const decodedSalt = Buffer.from(response.data.salt_base64, 'base64').toString('binary');
                        console.log('salt received', response.data.salt_base64);
                        offlineDatabaseService.saveSaltByToken(AppToken, decodedSalt, response.data.timestamp).then(
                            () => {
                                offlineDatabaseService
                                    .loadSaltByToken(AppToken)
                                    .then(() => setOfflineSaltStatus(OFFLINE_DATABASE_SYNCHRONIZED));
                            },
                            () => {
                                setTimeout(() => setOfflineSaltStatus(OFFLINE_DATABASE_DOWNLOAD_REQUIRED), 5000);
                            },
                        );
                    },
                    error => {
                        console.log('updateOfflineSalt', error);
                        setTimeout(() => setOfflineSaltStatus(OFFLINE_DATABASE_DOWNLOAD_REQUIRED), 5000);
                    },
                );
            });
        },
        [defaultURL, offlineDatabaseService, offlineSaltStatus],
    );

    useEffect(() => {
        if (offlineDatabaseSyncMode === OFFLINE_DATABASE_SYNC_MODE_ENABLE) {
            if (offlineSaltStatus === OFFLINE_DATABASE_NOT_LOADED) {
                updateOfflineSalt(userAppToken);
            }
        }
    }, [updateOfflineSalt, offlineDatabaseSyncMode, offlineSaltStatus, userAppToken]);

    useEffect(() => {
        if (offlineDatabaseSyncMode === OFFLINE_DATABASE_SYNC_MODE_ENABLE && databaseMode === DATABASE_MODE_ONLINE) {
            offlineDatabaseUpdateWorker();
        }

        return () => {
            if (offlineDatabaseWorkerId) {
                clearTimeout(offlineDatabaseWorkerId);
                setOfflineDatabaseWorkerId(null);
            }
        };
    }, [
        offlineDatabaseUpdateWorker,
        offlineDatabaseWorkerId,
        offlineDatabaseSyncMode,
        offlineDatabaseStatus,
        userAppToken,
        databaseMode,
    ]);

    useEffect(() => {
        if (offlineDatabaseSyncMode === OFFLINE_DATABASE_SYNC_MODE_ENABLE && databaseMode === DATABASE_MODE_ONLINE) {
            offlinePrivateKeyUpdateWorker();
        }

        return () => {
            if (offlinePrivateKeyWorkerId) {
                clearTimeout(offlinePrivateKeyWorkerId);
                setOfflinePrivateKeyWorkerId(null);
            }
        };
    }, [
        offlineDatabaseSyncMode,
        offlinePrivateKeyUpdateWorker,
        offlinePrivateKeyWorkerId,
        offlinePrivateKeyStatus,
        userAppToken,
        databaseMode,
    ]);

    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
            config => {
                if (databaseMode === DATABASE_MODE_OFFLINE) {
                    return Promise.reject({databaseMode: DATABASE_MODE_OFFLINE, config: config});
                }
                // Do something before request is sent
                return config;
            },
            error => {
                // Do something with request error
                console.log('Interceptor error handler', error);
                return Promise.reject(error);
            },
        );
        return () => {
            // console.log('request interceptors ejected');
            if (requestInterceptor) {
                axios.interceptors.request.eject(requestInterceptor);
            }
        };
    }, [databaseMode]);

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
                updateOfflineDatabase,
                userApplicationUnload,

                iconDisableColor,
            }}>
            {props.children}
        </UserApplicationContext.Provider>
    );
};

export default UserApplicationContextProvider;
