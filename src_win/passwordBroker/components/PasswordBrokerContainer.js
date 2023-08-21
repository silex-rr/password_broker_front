import {View} from "react-native-windows";
import tw from "twrnc";
import Head from "./Head";
import Main from "./Main";
import Footer from "./Footer";

const PasswordBrokerContainer = (props) => {
    return (
        <View style={tw`flex flex-col h-screen w-full`}>
            <Head/>
            <Main/>
            <Footer/>
        </View>
    )
}

export default PasswordBrokerContainer