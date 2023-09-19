import React from 'react';
import AppRouter from './AppRouter';
import {View} from 'react-native-windows';
import tw from 'twrnc';
import axios from 'axios';
import AppContextProvider from './AppContextProvider';

const App = () => {
    axios.defaults.withCredentials = true;
    return (
        <View style={tw`flex w-full justify-center bg-slate-600 h-full`}>
            <AppContextProvider>
                <AppRouter />
            </AppContextProvider>
        </View>
    );
};
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 24,
//         backgroundColor: '#eaeaea',
//     },
// })

export default App;
