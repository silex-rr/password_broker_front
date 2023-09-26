import React from 'react';
import {TextInput, View} from 'react-native-windows';
import tw from 'twrnc';

const Note = ({fieldValue, changeValue}) => {
    return (
        <View style={tw`py-1.5 items-center`}>
            <TextInput
                onChangeText={changeValue}
                placeholder="type new note"
                value={fieldValue}
                style={tw`textarea-bordered w-full bg-slate-800 text-slate-200 placeholder-slate-300`}
            />
        </View>
    );
};

export default Note;
