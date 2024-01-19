import React from 'react';
import {Text, View} from 'react-native-windows';
import tw from 'twrnc';
//, fieldValue, changeValue
export const File = ({entryId}) => {
    return (
        <View style={tw`flex flex-row py-1.5 items-center`}>
            <Text htmlFor={'add-field-for-' + entryId + '-value'} style={tw`inline-block basis-1/3 text-lg`}>
                File:
            </Text>
            <Text>Does not support on Windows</Text>
            {/*<Button*/}
            {/*    id={"add-field-for-" + entryId + "-value"}*/}
            {/*    style={tw`w-full basis-2/3 bg-slate-800 text-slate-200 `}*/}

            {/*    title="open picker for single file selection"*/}
            {/*    onPress={async () => {*/}
            {/*        try {*/}
            {/*            // const pickerResult = await DocumentPicker.pickSingle({*/}
            {/*            //     presentationStyle: 'fullScreen',*/}
            {/*            //     copyTo: 'cachesDirectory',*/}
            {/*            // })*/}
            {/*            // console.log([pickerResult])*/}
            {/*        } catch (e) {*/}
            {/*            // handleError(e)*/}
            {/*        }*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <Text>pick a file {addingFieldValue !== '' ? '[' + addingFieldValue + ']' : ''}</Text>*/}
            {/*</Button>*/}
        </View>
    );
};

export default File;
