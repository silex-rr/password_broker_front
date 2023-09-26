import {Text} from 'react-native-windows';
import tw from 'twrnc';
import React from 'react';
//onPress={() => Linking.openURL(value)}
const Link = ({value}) => {
    return <Text style={tw`px-2`}>{value}</Text>;
};

export default Link;
