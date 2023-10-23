import {View, Text} from 'react-native-windows';
import tw from 'twrnc';
import React from 'react';
import OfflineDatabase from './Footer/OfflineDatabase';

const Footer = () => {
    return (
        <View style={tw`bg-slate-700 text-slate-300 w-full py-2 px-10 flex justify-between flex-row`}>
            <View style={tw``}>
                <Text>Log:</Text>
            </View>
            <View style={tw``}>
                <OfflineDatabase />
            </View>
        </View>
    );
};

export default Footer;
