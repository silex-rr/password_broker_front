import {Text} from 'react-native-windows';
import React from 'react';

import tw from 'twrnc';
import CopyToClipboard from './CopyToClipboard';

const Note = ({value}) => {
    return (
        <CopyToClipboard style={tw`px-2`} value={value}>
            <Text>{value}</Text>
        </CopyToClipboard>
    );
};

export default Note;
