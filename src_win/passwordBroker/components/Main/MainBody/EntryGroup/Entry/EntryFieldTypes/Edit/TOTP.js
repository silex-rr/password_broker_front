import React from 'react';
import {Text, TextInput, View} from 'react-native-windows';
import tw from 'twrnc';

const TOTP = ({entryId, fieldValue, changeValue}) => {
    return (
        <View style={tw`flex flex-row py-1.5 items-center`}>
            <Text htmlFor={'add-field-for-' + entryId + '-value'} style={tw`inline-block basis-1/3 text-lg`}>
                OTP secret key:
            </Text>
            <TextInput
                id={'add-field-for-' + entryId + '-value'}
                style={tw`basis-2/3 bg-slate-800 text-slate-200 `}
                onChangeText={changeValue}
                placeholder="put OTP secret key here"
                value={fieldValue}
            />
        </View>
    );
};

export default TOTP;
