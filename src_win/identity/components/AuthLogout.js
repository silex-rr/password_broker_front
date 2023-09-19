import {useNavigate} from 'react-router-native';
import React, {useContext, useEffect} from 'react';
import IdentityContext from '../../../src_shared/identity/contexts/IdentityContext';
import {Text, View} from 'react-native-windows';
import tw from 'twrnc';

const AuthLogout = () => {
    const identityContext = useContext(IdentityContext);
    const navigate = useNavigate();
    const {logout} = identityContext;
    useEffect(() => {
        logout(navigate);
    }, [logout, navigate]);
    return (
        <View style={tw``}>
            <Text style={tw`text-4xl text-slate-700 text-center`}>Logout</Text>
        </View>
    );
};

export default AuthLogout;
