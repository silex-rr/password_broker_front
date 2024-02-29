import {Text} from 'react-native-windows';
import tw from 'twrnc';
import React from 'react';
import CopyToClipboard from './CopyToClipboard';

const Link = ({value}) => {
    return (
        <CopyToClipboard value={value} style={tw`px-2`}>
            <Text>{value}</Text>
        </CopyToClipboard>
    );
};

export default Link;
