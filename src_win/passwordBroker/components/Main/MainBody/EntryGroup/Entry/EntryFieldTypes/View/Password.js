import React from 'react';
import {Text, View} from 'react-native-windows';
import tw from 'twrnc';

const Password = ({login, value}) => {
    return (
        <View style={tw`flex flex-row p-0 m-0`}>
            <View style={tw`px-2 flex flex-row`}>
                <Text style={tw`text-slate-400 pr-3`}>login: </Text>
                <Text>{login}</Text>
            </View>
            <View style={tw`px-2 flex flex-row`}>
                <Text style={value === '' ? tw`hidden` : tw`text-slate-400 pr-3`}>password: </Text>
                <Text>{value}</Text>
            </View>
        </View>
    );
};

export default Password;
