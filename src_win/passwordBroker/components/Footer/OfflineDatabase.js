import {ActivityIndicator, Text, View} from 'react-native-windows';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, {useContext, useEffect} from 'react';
import tw from 'twrnc';
import UserApplicationContext from '../../../../src_shared/identity/contexts/UserApplicationContext';
import {
    OFFLINE_DATABASE_SYNC_MODE_AWAIT,
    OFFLINE_DATABASE_SYNC_MODE_DISABLE,
    OFFLINE_DATABASE_SYNC_MODE_ENABLE,
    OFFLINE_DATABASE_SYNC_MODE_LOADING,
    OFFLINE_DATABASE_SYNC_MODE_UPDATING,
} from '../../../../src_shared/identity/constants/OfflineDatabaseSyncModeStates';
import {
    APPLICATION_ERROR,
    APPLICATION_LOADED,
    APPLICATION_LOADING,
    APPLICATION_NOT_LOADED,
} from '../../../../src_shared/identity/constants/ApplicationStates';
import {
    DATABASE_MODE_OFFLINE,
    DATABASE_MODE_ONLINE,
    DATABASE_MODE_SWITCHING_TO_OFFLINE,
} from '../../../../src_shared/identity/constants/DatabaseModeStates';
import GlobalContext from '../../../../src_shared/common/contexts/GlobalContext';

const OfflineDatabase = () => {
    const {
        applicationIdState,
        offlineDatabaseSyncMode,
        databaseMode,

        isOfflineDatabaseReady,

        loadUserApplication,
        getOfflineDatabaseSyncMode,
        enableOfflineDatabaseSyncMode,
        disableOfflineDatabaseSyncMode,
        reloadApplication,
        switchDatabaseToOffline,
        switchDatabaseToOnline,
        iconDisableColor,
    } = useContext(UserApplicationContext);
    const {logActivityManual} = useContext(GlobalContext);

    const toggleSyncIcon =
        offlineDatabaseSyncMode === OFFLINE_DATABASE_SYNC_MODE_ENABLE ? 'toggle-switch' : 'toggle-switch-off-outline';
    const toggleIsOfflineIcon = databaseMode === DATABASE_MODE_OFFLINE ? 'toggle-switch' : 'toggle-switch-off-outline';
    const iconSize = 21;
    let iconSyncColor = iconDisableColor;
    if (databaseMode === DATABASE_MODE_ONLINE) {
        iconSyncColor = offlineDatabaseSyncMode === OFFLINE_DATABASE_SYNC_MODE_ENABLE ? '#61e635' : '#CCCCCC';
    }
    const iconDatabaseIsOfflineColor = databaseMode === DATABASE_MODE_OFFLINE ? '#61e635' : '#CCCCCC';

    const offlineSyncModePressHandles = () => {
        switch (offlineDatabaseSyncMode) {
            case OFFLINE_DATABASE_SYNC_MODE_ENABLE:
                disableOfflineDatabaseSyncMode();
                break;
            case OFFLINE_DATABASE_SYNC_MODE_DISABLE:
                enableOfflineDatabaseSyncMode();
                break;
            default:
            //
        }
    };

    const toggleDatabaseMode = () => {
        if (!isOfflineDatabaseReady() && databaseMode !== DATABASE_MODE_OFFLINE) {
            logActivityManual('Offline Database isn`t ready');
            return;
        }

        if (databaseMode === DATABASE_MODE_ONLINE) {
            switchDatabaseToOffline();
            return;
        }
        switchDatabaseToOnline();
    };

    const reloadApplicationPressHandler = () => {
        reloadApplication();
    };

    useEffect(() => {
        if (databaseMode === DATABASE_MODE_OFFLINE) {
            return;
        }

        if (applicationIdState !== APPLICATION_LOADED) {
            if (applicationIdState === APPLICATION_NOT_LOADED) {
                loadUserApplication();
            }
            return;
        }

        if (offlineDatabaseSyncMode !== OFFLINE_DATABASE_SYNC_MODE_AWAIT) {
            return;
        }
        getOfflineDatabaseSyncMode();
    }, [offlineDatabaseSyncMode, getOfflineDatabaseSyncMode, applicationIdState, loadUserApplication, databaseMode]);

    if (
        applicationIdState === APPLICATION_LOADING ||
        offlineDatabaseSyncMode === OFFLINE_DATABASE_SYNC_MODE_LOADING ||
        offlineDatabaseSyncMode === OFFLINE_DATABASE_SYNC_MODE_UPDATING ||
        databaseMode === DATABASE_MODE_SWITCHING_TO_OFFLINE
    ) {
        return (
            <View style={tw`flex flex-row justify-between items-start`}>
                <View style={tw`flex flex-row justify-center`}>
                    <View style={tw`px-2`}>
                        <ActivityIndicator size="small" color="#e2e8f0" />
                    </View>
                    <Text>loading ...</Text>
                </View>
            </View>
        );
    }

    if (applicationIdState === APPLICATION_ERROR) {
        return (
            <View style={tw`flex flex-row justify-between items-start`}>
                <View style={tw`flex flex-row justify-center`}>
                    <Text style={tw`text-red-300`}>loading error</Text>
                    <Text style={tw`ml-2 text-green-400 underline`} onPress={reloadApplicationPressHandler}>
                        reload
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={tw`flex flex-row justify-between items-start`}>
            <Text style={tw`${databaseMode === DATABASE_MODE_OFFLINE ? 'text-gray-500' : ''}`}>Sync Offline:</Text>
            <Text
                style={tw`pl-1`}
                onPress={offlineSyncModePressHandles}
                disabled={databaseMode === DATABASE_MODE_OFFLINE}>
                <MaterialCommunityIcons name={toggleSyncIcon} size={iconSize} color={iconSyncColor} />
            </Text>
            <Text style={tw`pl-2`}>Offline mode:</Text>
            <Text style={tw`pl-1`} onPress={toggleDatabaseMode}>
                <MaterialCommunityIcons name={toggleIsOfflineIcon} size={iconSize} color={iconDatabaseIsOfflineColor} />
            </Text>
        </View>
    );
};
export default OfflineDatabase;
