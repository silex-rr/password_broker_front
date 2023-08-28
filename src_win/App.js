import React from "react";
import {AppProvider} from "./AppContext";
import AppRouter from "./AppRouter";
import {View, StyleSheet, Text} from "react-native-windows";
import tw from "twrnc"
import axios from "axios";



const App = () => {
    axios.defaults.withCredentials = true;
    return (
        <View style={tw`flex w-full justify-center bg-slate-600 h-full`}>
            <AppProvider>
                <AppRouter />
            </AppProvider>
        </View>
    )
}
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 24,
//         backgroundColor: '#eaeaea',
//     },
// })

export default App