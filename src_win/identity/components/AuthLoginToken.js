import {Text, TouchableOpacity, View} from "react-native-windows";
import tw from "twrnc";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const AuthLoginToken = ({appToken, login, remove}) => {

    return (
        <View>
            <TouchableOpacity style={tw`flex flex-row rounded py-1 justify-evenly border border-slate-700`}
                onPress={login}
            >
                <Text style={tw`text-slate-400 text-center`}>{appToken.url}</Text>
                <Text style={tw`text-slate-700 text-center`}>{appToken.login}</Text>
                <TouchableOpacity activeOpacity={1} style={tw` ml-2`} onPress={remove}>
                    <MaterialCommunityIcons name={'selection-remove'} size={20} color={'red'}/>
                </TouchableOpacity>
            </TouchableOpacity>
        </View>
    )
}

export default AuthLoginToken