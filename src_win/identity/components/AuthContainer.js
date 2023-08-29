import tw from "twrnc";
import {View} from "react-native-windows";

const AuthContainer = (props) => {
    return (
        <View style={tw`flex w-full items-center pt-16 pb-32`}>
            <View style={tw`w-96`}>
                <View style={tw`justify-end`}>
                    <View style={tw`flex rounded`}>
                        <View style={tw`bg-slate-200 py-24 px-12 rounded-lg`}>
                            {props.children}
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default AuthContainer