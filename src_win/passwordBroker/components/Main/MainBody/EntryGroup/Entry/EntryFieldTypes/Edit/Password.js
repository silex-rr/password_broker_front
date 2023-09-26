import React from 'react';
import {Text, TextInput, View} from 'react-native-windows';
import tw from 'twrnc';

const Password = ({entryId, fieldLogin, fieldValue, changeLogin, changeValue}) => {
    return (
        <View style={tw`py-1.5 items-center`}>
            <View style={tw`flex flex-row `}>
                <Text htmlFor={'add-field-for-' + entryId + '-login'} style={tw`inline-block basis-1/3 text-lg`}>
                    Login:
                </Text>
                <TextInput
                    id={'add-field-for-' + entryId + '-login'}
                    style={tw`basis-2/3 bg-slate-800
                             text-slate-200 placeholder-slate-300`}
                    onChangeText={changeLogin}
                    placeholder="type new login"
                    value={fieldLogin}
                />
            </View>
            <View style={tw`flex flex-row `}>
                <Text htmlFor={'add-field-for-' + entryId + '-value'} style={tw`inline-block basis-1/3 text-lg`}>
                    Password:
                </Text>
                <TextInput
                    id={'add-field-for-' + entryId + '-value'}
                    style={tw`basis-2/3 bg-slate-800 
                                text-slate-200 placeholder-slate-300`}
                    onChangeText={changeValue}
                    placeholder="type new password"
                    secureTextEntry={true}
                    value={fieldValue}
                />
            </View>
        </View>
    );
};

export default Password;
