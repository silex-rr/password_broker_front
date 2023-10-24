import React, {useContext, useEffect} from 'react';
import IdentityContext from '../../../src_shared/identity/contexts/IdentityContext';
import {
    LOG_IN_FORM,
    LOGGED_IN,
    SIGN_UP_FORM,
    // TOKEN_SELECTION_PAGE,
} from '../../../src_shared/identity/constants/AuthStatus';
import {Navigate, useLocation} from 'react-router-native';
import {Text, View} from 'react-native-windows';
import tw from 'twrnc';

const AuthLoading = () => {
    const location = useLocation();
    const identityContext = useContext(IdentityContext);
    const {getUser, authStatus} = identityContext;

    useEffect(() => {
        if (authStatus === '') {
            getUser(location);
        }
    }, [authStatus, getUser, location]);
    console.log(authStatus);
    switch (authStatus) {
        case LOGGED_IN:
            let path = '/';
            if (location?.state?.from?.pathname) {
                path = location.state.from.pathname;
            }
            console.log(path);
            return <Navigate to={path} replace={true} />;
        case LOG_IN_FORM:
            return <Navigate to="/identity/login" replace={true} />;
        case SIGN_UP_FORM:
            return <Navigate to="/identity/signup" replace={true} />;
    }

    return (
        <View style={tw``}>
            <Text style={tw`text-4xl text-slate-700 text-center`}>Loading</Text>
        </View>
    );
};

export default AuthLoading;
