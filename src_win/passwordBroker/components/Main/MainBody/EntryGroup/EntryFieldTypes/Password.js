import React from "react";
import {Text, View} from "react-native-windows";
import tw from "twrnc";

const Password = ({login, value}) => {
    return (
        <React.Fragment>
            <View style={tw`px-2 basis-1/4`}>
                <Text style={tw`text-slate-400 pr-3`} >login: </Text>
                <Text>
                   {login}
                </Text>
            </View>
            <View style={tw`px-2 basis-1/4`}>
                <Text style={value === '' ? tw`hidden` : tw`text-slate-400 pr-3`}>password: </Text>
                <Text>
                    {value}
                </Text>
            </View>
        </React.Fragment>
    )
}

export default Password