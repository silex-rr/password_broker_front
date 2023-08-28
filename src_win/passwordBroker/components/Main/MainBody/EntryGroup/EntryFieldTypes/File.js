import React from "react"
import prettyBytes from "pretty-bytes";
import {Text, View} from "react-native-windows";
import tw from "twrnc";

const File = ({fileName, fileSize, fileMime}) => {
    const fileSizePrettified = prettyBytes(fileSize)
    return (
        <React.Fragment>
            <View style={tw`px-2 basis-1/6`}>
                <Text style={tw`text-slate-400 pr-3`} >name: </Text>
                <Text>
                    {fileName}
                </Text>
            </View>
            <View style={tw`px-2 basis-1/6`}>
                <Text style={tw`text-slate-400 pr-3`} >mime: </Text>
                <Text>
                    {fileMime}
                </Text>
            </View>
            <View style={tw`px-2 basis-1/6`}>
                <Text style={tw`text-slate-400 pr-3`} >size: </Text>
                <Text>
                    {fileSizePrettified}
                </Text>
            </View>
        </React.Fragment>
    )
}

export default File