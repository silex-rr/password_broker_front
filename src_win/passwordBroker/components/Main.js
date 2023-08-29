import MainLeftMenu from "./Main/MainLeftMenu";
import MainBody from "./Main/MainBody";
import {View} from "react-native-windows";
import tw from "twrnc";

const Main = (props) => {
    return (
        <View style={tw`mb-auto flex flex-row flex-grow`}>
            <MainLeftMenu/>
            <MainBody/>
        </View>
    )
}

export default Main