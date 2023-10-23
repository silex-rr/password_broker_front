import {ActivityIndicator, Text, View} from 'react-native-windows';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, {useContext, useEffect} from 'react';
import tw from 'twrnc';
import UserApplicationContext from '../../../../src_shared/identity/contexts/UserApplicationContext';
import {
    OFFLINE_DATABASE_MODE_AWAIT,
    OFFLINE_DATABASE_MODE_DISABLE,
    OFFLINE_DATABASE_MODE_ENABLE,
    OFFLINE_DATABASE_MODE_LOADING,
    OFFLINE_DATABASE_MODE_UPDATING,
} from '../../../../src_shared/identity/constants/OfflineDatabaseModeStates';
import {
    APPLICATION_ERROR,
    APPLICATION_LOADED,
    APPLICATION_LOADING,
    APPLICATION_NOT_LOADED,
} from '../../../../src_shared/identity/constants/ApplicationStates';

const OfflineDatabase = () => {
    const {
        applicationIdState,
        offlineDatabaseMode,

        loadUserApplication,
        getOfflineDatabaseMode,
        enableOfflineDatabaseMode,
        disableOfflineDatabaseMode,
        reloadApplication,
    } = useContext(UserApplicationContext);

    const toggleIcon =
        offlineDatabaseMode === OFFLINE_DATABASE_MODE_ENABLE ? 'toggle-switch' : 'toggle-switch-off-outline';
    const iconSize = 21;
    const iconColor = offlineDatabaseMode === OFFLINE_DATABASE_MODE_ENABLE ? '#61e635' : '#CCCCCC';

    const offlineSyncModePressHandles = () => {
        switch (offlineDatabaseMode) {
            case OFFLINE_DATABASE_MODE_ENABLE:
                disableOfflineDatabaseMode();
                break;
            case OFFLINE_DATABASE_MODE_DISABLE:
                enableOfflineDatabaseMode();
                break;
            default:
            //
        }
    };

    const reloadApplicationPressHandler = () => {
        reloadApplication();
    };

    useEffect(() => {
        if (applicationIdState !== APPLICATION_LOADED) {
            if (applicationIdState === APPLICATION_NOT_LOADED) {
                loadUserApplication();
            }
            return;
        }

        if (offlineDatabaseMode !== OFFLINE_DATABASE_MODE_AWAIT) {
            return;
        }
        getOfflineDatabaseMode();
    }, [offlineDatabaseMode, getOfflineDatabaseMode, applicationIdState, loadUserApplication]);

    if (
        applicationIdState === APPLICATION_LOADING ||
        offlineDatabaseMode === OFFLINE_DATABASE_MODE_LOADING ||
        offlineDatabaseMode === OFFLINE_DATABASE_MODE_UPDATING
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
            <Text style={tw``}>Sync Offline:</Text>
            <Text style={tw`pl-1`} onPress={offlineSyncModePressHandles}>
                <MaterialCommunityIcons name={toggleIcon} size={iconSize} color={iconColor} />
            </Text>
            <Text style={tw`pl-2`}>Offline mode:</Text>
            <Text style={tw`pl-1`}>
                <MaterialCommunityIcons name={toggleIcon} size={iconSize} color={iconColor} />
            </Text>
        </View>
    );
};
export default OfflineDatabase;
