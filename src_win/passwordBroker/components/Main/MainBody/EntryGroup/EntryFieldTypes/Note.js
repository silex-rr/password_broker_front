import {Text} from 'react-native-windows';
import React from 'react';

import tw from 'twrnc';

const Note = ({value}) => {
    return <Text style={tw`px-2`}>{value}</Text>;
};

export default Note;
