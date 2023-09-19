import React, {useContext, useState} from 'react';
import IdentityContext from '../../../src_shared/identity/contexts/IdentityContext';
import {Navigate} from 'react-router-dom';
import {LOGGED_IN} from '../../../src_shared/identity/constants/AuthStatus';
import {Text, TextInput, TouchableOpacity, View} from 'react-native-windows';
import tw from 'twrnc';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AuthLoginTokens from './AuthLoginTokens';

const AuthLogin = () => {
    const {
        userEmail,
        userPassword,
        handleUserEmail,
        handleUserPassword,
        handleHostURL,
        hostURL,
        login,
        errorMessage,
        authStatus,
        appTokensService,
    } = useContext(IdentityContext);

    const [tokens, setTokens] = useState(appTokensService.getTokens());

    if (authStatus === LOGGED_IN) {
        return <Navigate to="/" replace />;
    }
    //console-network
    //database
    //lan
    return (
        <React.Fragment>
            <View style={tw`mb-8`}>
                <Text style={tw`text-4xl text-slate-700 text-center`}>Login</Text>
            </View>

            <View style={tw`mb-4 flex flex-row`}>
                <View style={tw`bg-slate-500 pt-1 basis-1/6 items-center`}>
                    <MaterialCommunityIcons name="console-network" size={28} color="white" />
                </View>
                <View style={tw` basis-5/6`}>
                    <TextInput
                        style={tw`w-full bg-slate-300 text-slate-800 pl-3 py-2`}
                        placeholder="Server URL [https://example.com]"
                        placeholderTextColor="#64748b"
                        onChangeText={handleHostURL}
                        value={hostURL}
                    />
                </View>
            </View>

            <View style={tw`mb-4 flex flex-row`}>
                <View style={tw`bg-slate-500 pt-1 basis-1/6 items-center`}>
                    <MaterialCommunityIcons name="email" size={28} color="white" />
                </View>
                <View style={tw` basis-5/6`}>
                    <TextInput
                        style={tw`w-full bg-slate-300 text-slate-800 pl-3 py-2`}
                        placeholder="Email"
                        placeholderTextColor="#64748b"
                        onChangeText={handleUserEmail}
                        value={userEmail}
                    />
                </View>
            </View>

            <View style={tw`mb-4 flex flex-row`}>
                <View style={tw`bg-slate-500 pt-1 basis-1/6 items-center`}>
                    <MaterialCommunityIcons name="key-variant" size={28} color="white" />
                </View>
                <View style={tw`basis-5/6`}>
                    <TextInput
                        style={tw`w-full bg-slate-300 text-slate-800 pl-3 py-2 hover:bg-slate-300`}
                        placeholder="Password"
                        placeholderTextColor="#64748b"
                        secureTextEntry={true}
                        onChangeText={handleUserPassword}
                        value={userPassword}
                    />
                </View>
            </View>

            <View style={tw`flex justify-center w-full mt-10`}>
                <TouchableOpacity onPress={login}>
                    <Text style={tw`text-slate-700 text-center rounded py-2 px-10 border border-slate-700`}>Login</Text>
                </TouchableOpacity>
            </View>

            {tokens.length ? <AuthLoginTokens tokens={tokens} setTokens={setTokens} /> : ''}

            <View>
                {errorMessage !== '' ? (
                    <Text style={tw`w-full text-red-600 text-center mt-8`}>{errorMessage}</Text>
                ) : (
                    ''
                )}
            </View>
        </React.Fragment>
    );
};

export default AuthLogin;
