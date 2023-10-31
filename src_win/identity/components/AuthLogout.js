import {useNavigate} from 'react-router-native';
import React, {useContext, useEffect} from 'react';
import IdentityContext from '../../../src_shared/identity/contexts/IdentityContext';
import {Text, View} from 'react-native-windows';
import tw from 'twrnc';
import UserApplicationContext from '../../../src_shared/identity/contexts/UserApplicationContext';
import {DATABASE_MODE_OFFLINE} from '../../../src_shared/identity/constants/DatabaseModeStates';

const AuthLogout = () => {
    const identityContext = useContext(IdentityContext);
    const {databaseMode, switchDatabaseToOnline} = useContext(UserApplicationContext);
    const navigate = useNavigate();
    const {logout} = identityContext;
    useEffect(() => {
        logout(navigate, databaseMode);
        if (databaseMode === DATABASE_MODE_OFFLINE) {
            switchDatabaseToOnline();
        }
    }, [logout, navigate, databaseMode, switchDatabaseToOnline]);
    return (
        <View style={tw``}>
            <Text style={tw`text-4xl text-slate-700 text-center`}>Logout</Text>
        </View>
    );
};

export default AuthLogout;
