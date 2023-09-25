import React from 'react';
import {Text, TextInput, View} from 'react-native-windows';
import tw from 'twrnc';

const Link = ({entryId, fieldValue, changeValue}) => {
    return (
        <View style={tw`flex flex-row py-1.5 items-center`}>
            <Text htmlFor={'add-field-for-' + entryId + '-value'} style={tw`inline-block basis-1/3 text-lg`}>
                Link:
            </Text>
            <TextInput
                id={'add-field-for-' + entryId + '-value'}
                style={tw`basis-2/3 bg-slate-800 text-slate-200 placeholder-slate-300`}
                onChangeText={changeValue}
                placeholder="put new link"
                value={fieldValue}
            />
        </View>
    );
};

export default Link;
