import tw from "twrnc";
import {View} from "react-native-windows";

const AuthContainer = (props) => {
    return (
        <View style={tw`flex w-full justify-center items-center pt-16 pb-32`}>
            <View style={tw`w-96`}>
                <View style={tw`justify-end py-4`}>
                    {props.children}
                </View>
            </View>
        </View>
    )
}

export default AuthContainer