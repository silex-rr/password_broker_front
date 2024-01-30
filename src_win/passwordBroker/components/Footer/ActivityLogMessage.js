import React from 'react';
import {Text, View} from 'react-native-windows';
import tw from 'twrnc';

const ActivityLogMessage = ({message}) => {
    return (
        <View style={tw`flex flex-row bg-slate-700 px-1`}>
            <Text style={tw`text-xs text-slate-400 w-14 pl-1 pt-0.5`}>{message.time}</Text>
            <Text style={tw`text-slate-300`}>{message.body}</Text>
        </View>
    );
};

export default ActivityLogMessage;
