import React from 'react';
import {View} from 'react-native-windows';
import tw from 'twrnc';
import Head from './Head';
import Footer from './Footer';
import MainLeftMenu from './Main/MainLeftMenu';
import SearchResult from './Main/SearchResult';

const PasswordBrokerContainer = () => {
    return (
        <View style={tw`flex flex-col w-full h-full`}>
            <Head />
            <View style={tw`mb-auto flex flex-row flex-grow`}>
                <MainLeftMenu />
                <View style={tw`p-0 text-slate-100 bg-slate-600 w-full shrink`}>
                    <SearchResult />
                </View>
            </View>
            <Footer />
        </View>
    );
};

export default PasswordBrokerContainer;
