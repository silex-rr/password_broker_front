import {Linking, Text, View} from "react-native-windows";
import tw from "twrnc";
//onPress={() => Linking.openURL(value)}
const Link = ({value}) => {
    return (
        <View style={tw`col-span-3 px-2 basis-1/2`}>
            <Text >{value}</Text>
        </View>
    )
}

export default Link