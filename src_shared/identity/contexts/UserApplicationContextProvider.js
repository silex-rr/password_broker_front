import UserApplicationContext from './UserApplicationContext';
import axios from 'axios';
import React from 'react';
import {useState} from 'react';
import {
    OFFLINE_DATABASE_MODE_AWAIT,
    OFFLINE_DATABASE_MODE_DISABLE,
    OFFLINE_DATABASE_MODE_ENABLE,
    OFFLINE_DATABASE_MODE_ERROR,
    OFFLINE_DATABASE_MODE_LOADING,
    OFFLINE_DATABASE_MODE_UPDATING,
} from '../constants/OfflineDatabaseModeStates';
import {
    APPLICATION_ERROR,
    APPLICATION_LOADED,
    APPLICATION_LOADING,
    APPLICATION_NOT_LOADED,
} from '../constants/ApplicationStates';

const UserApplicationContextProvider = props => {
    let hostURLDefault = '';

    const getClientId = props.getClientId
        ? props.getClientId
        : async () => {
              return '';
          };

    if (props.hostURL) {
        hostURLDefault = props.hostURL;
    } else if (process.env.REACT_APP_PASSWORD_BROKER_HOST) {
        hostURLDefault = process.env.REACT_APP_PASSWORD_BROKER_HOST;
    }

    const defaultURL = hostURLDefault + '/identity/api';

    const [applicationId, setApplicationId] = useState('');
    const [applicationIdState, setApplicationIdState] = useState(APPLICATION_NOT_LOADED);
    const [offlineDatabaseMode, setOfflineDatabaseMode] = useState(OFFLINE_DATABASE_MODE_AWAIT);

    const loadUserApplication = () => {
        if (applicationIdState === APPLICATION_LOADING) {
            return;
        }
        setApplicationIdState(APPLICATION_LOADING);
        getClientId().then(clientId => {
            axios.post(defaultURL + '/userApplications', {clientId: clientId}).then(
                result => {
                    setApplicationId(result.data.userApplication.user_application_id);
                    setOfflineDatabaseMode(
                        result.data.userApplication.is_offline_database_mode
                            ? OFFLINE_DATABASE_MODE_ENABLE
                            : OFFLINE_DATABASE_MODE_DISABLE,
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
    const getOfflineDatabaseMode = () => {
        setOfflineDatabaseMode(OFFLINE_DATABASE_MODE_LOADING);
        axios.get(defaultURL + '/userApplication/' + applicationId + '/offlineDatabaseMode').then(
            result => {
                setOfflineDatabaseMode(
                    result.data.status ? OFFLINE_DATABASE_MODE_ENABLE : OFFLINE_DATABASE_MODE_DISABLE,
                );
            },
            error => {
                console.log('getOfflineDatabaseMode', error);
                setOfflineDatabaseMode(OFFLINE_DATABASE_MODE_ERROR);
            },
        );
    };
    const enableOfflineDatabaseMode = () => {
        switchOfflineDatabaseMode(true);
    };

    const disableOfflineDatabaseMode = () => {
        switchOfflineDatabaseMode(false);
    };

    const switchOfflineDatabaseMode = (status = true) => {
        setOfflineDatabaseMode(OFFLINE_DATABASE_MODE_UPDATING);
        axios.put(defaultURL + '/userApplication/' + applicationId + '/offlineDatabaseMode', {status: status}).then(
            () => {
                setOfflineDatabaseMode(status ? OFFLINE_DATABASE_MODE_ENABLE : OFFLINE_DATABASE_MODE_DISABLE);
            },
            error => {
                console.log('switchOfflineDatabaseMode', error);
                setOfflineDatabaseMode(OFFLINE_DATABASE_MODE_ERROR);
            },
        );
    };

    const reloadApplication = () => {
        setApplicationIdState(APPLICATION_NOT_LOADED);
    };

    return (
        <UserApplicationContext.Provider
            value={{
                applicationId,
                applicationIdState,
                offlineDatabaseMode,

                loadUserApplication,
                getOfflineDatabaseMode,
                enableOfflineDatabaseMode,
                disableOfflineDatabaseMode,
                reloadApplication,
            }}>
            {props.children}
        </UserApplicationContext.Provider>
    );
};

export default UserApplicationContextProvider;
