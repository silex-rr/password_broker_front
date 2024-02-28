import React, {useRef} from 'react';
import {Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native-windows';
import tw from 'twrnc';
import CopyToClipboard from './CopyToClipboard';

const Password = ({login, value}) => {
    return (
        <View style={tw`flex flex-row flex-wrap p-0 m-0`}>
            <CopyToClipboard value={login} style={tw`px-2`}>
                <Text style={tw`text-slate-400 pr-3`}>login: </Text>
                <Text>{login}</Text>
            </CopyToClipboard>
            <CopyToClipboard value={value} style={tw`px-2`}>
                <Text style={value === '' ? tw`hidden` : tw`text-slate-400 pr-3`}>pass: </Text>
                <Text>{value}</Text>
            </CopyToClipboard>
        </View>
    );
};

export default Password;
