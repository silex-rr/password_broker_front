import React, {useContext, useEffect} from 'react';
import IdentityContext from '../../../src_shared/identity/contexts/IdentityContext';
import {LOG_IN_FORM, LOGGED_IN, NETWORK_ERROR, SIGN_UP_FORM} from '../../../src_shared/identity/constants/AuthStatus';
import {Navigate, useLocation} from 'react-router-native';
import {Text, View} from 'react-native-windows';
import tw from 'twrnc';
import {AUTH_MODE_BEARER_TOKEN} from '../../../src_shared/identity/constants/AuthMode';
import AuthLoadingOfflineMode from './AuthLoadingOfflineMode';

const AuthLoading = () => {
    const location = useLocation();
    const identityContext = useContext(IdentityContext);
    const {authMode, authStatus, changeAuthStatusLogin, appTokensService, getUser, userAppToken} = identityContext;
    useEffect(() => {
        if (authStatus === '') {
            if (authMode === AUTH_MODE_BEARER_TOKEN && userAppToken === null) {
                appTokensService.load().then(() => {
                    changeAuthStatusLogin();
                });
            } else {
                getUser(location);
            }
        }
    }, [appTokensService, authMode, authStatus, changeAuthStatusLogin, getUser, location, userAppToken]);
    console.log('AuthLoading.authStatus', authStatus);
    switch (authStatus) {
        case LOGGED_IN:
            // console.log(path);
            let path = '/';
            if (location?.state?.from?.pathname) {
                path = location.state.from.pathname;
            }
            return <Navigate to={path} replace={true} />;
        case LOG_IN_FORM:
            return <Navigate to="/identity/login" replace={true} />;
        case SIGN_UP_FORM:
            return <Navigate to="/identity/signup" replace={true} />;
    }

    return (
        <View style={tw``}>
            {authStatus === NETWORK_ERROR ? (
                <AuthLoadingOfflineMode />
            ) : (
                <Text style={tw`text-4xl text-slate-700 text-center`}>Loading</Text>
            )}
        </View>
    );
};

export default AuthLoading;
