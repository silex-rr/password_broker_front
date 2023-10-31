import React, {useContext, useEffect} from 'react';
import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native-windows';
import IdentityContext from '../../../src_shared/identity/contexts/IdentityContext';
import tw from 'twrnc';
import UserApplicationContext from '../../../src_shared/identity/contexts/UserApplicationContext';
import {
    DATABASE_MODE_OFFLINE,
    DATABASE_MODE_ONLINE,
    DATABASE_MODE_SWITCHING_TO_OFFLINE,
} from '../../../src_shared/identity/constants/DatabaseModeStates';

const AuthLoadingOfflineMode = () => {
    const {hostURL, userAppToken, changeAuthStatusLogin, loginByToken, offlineLoginByToken} =
        useContext(IdentityContext);
    const {databaseMode, switchDatabaseToOffline} = useContext(UserApplicationContext);

    const tryAgainHandler = () => {
        changeAuthStatusLogin();
        loginByToken(userAppToken);
    };

    const offlineModeHandler = () => {
        if (databaseMode === DATABASE_MODE_ONLINE) {
            switchDatabaseToOffline();
        }
    };

    useEffect(() => {
        if (databaseMode === DATABASE_MODE_OFFLINE) {
            offlineLoginByToken(userAppToken);
        }
    }, [offlineLoginByToken, databaseMode, userAppToken]);

    return (
        <View>
            <Text style={tw`text-3xl text-red-700 text-center mb-2`}>Network error</Text>
            <Text style={tw`text-l text-slate-700 text-center`}>cannot connect to {hostURL}</Text>
            <View style={tw`flex flex-col mt-5`}>
                <TouchableOpacity
                    onPress={tryAgainHandler}
                    style={tw`rounded py-2 px-10 border border-slate-700 flex flex-row justify-center`}>
                    <Text style={tw`text-slate-700`}>Try again</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={offlineModeHandler}
                    style={tw`rounded py-2 px-10 border border-slate-700 flex flex-row justify-center mt-2`}>
                    {databaseMode === DATABASE_MODE_SWITCHING_TO_OFFLINE ? (
                        <View style={tw`px-4 w-5`}>
                            <ActivityIndicator size="small" color="#000000" />
                        </View>
                    ) : (
                        ''
                    )}
                    <Text style={tw`text-slate-700`}>Offline mode</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default AuthLoadingOfflineMode;
