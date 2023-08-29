import React from "react"
import prettyBytes from "pretty-bytes";
import {Text, View} from "react-native-windows";
import tw from "twrnc";

const File = ({fileName, fileSize, fileMime}) => {
    const fileSizePrettified = prettyBytes(fileSize)
    return (
        <View style={tw`flex flex-row p-0 m-0`}>
            <View style={tw`px-2 basis-1/3`}>
                <Text style={tw`text-slate-400 pr-3`} >name: </Text>
                <Text>
                    {fileName}
                </Text>
            </View>
            <View style={tw`px-2 basis-1/3`}>
                <Text style={tw`text-slate-400 pr-3`} >mime: </Text>
                <Text>
                    {fileMime}
                </Text>
            </View>
            <View style={tw`px-2 basis-1/3`}>
                <Text style={tw`text-slate-400 pr-3`} >size: </Text>
                <Text>
                    {fileSizePrettified}
                </Text>
            </View>
        </View>
    )
}

export default File