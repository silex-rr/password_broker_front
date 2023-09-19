import {View} from 'react-native-windows';
import tw from 'twrnc';
import Head from './Head';
import Main from './Main';
import Footer from './Footer';
import React from 'react';
const PasswordBrokerContainer = () => {
    return (
        <View style={tw`flex flex-col w-full h-full`}>
            <Head />
            <Main />
            <Footer />
        </View>
    );
};

export default PasswordBrokerContainer;
