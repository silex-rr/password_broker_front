import {View, Text} from 'react-native-windows';
import tw from 'twrnc';
import React, {useContext} from 'react';
import OfflineDatabase from './Footer/OfflineDatabase';
import IdentityContext from '../../../src_shared/identity/contexts/IdentityContext';

const Footer = () => {
    const {userIsAdmin} = useContext(IdentityContext);
    return (
        <View style={tw`bg-slate-700 text-slate-300 w-full py-2 px-10 flex justify-between flex-row`}>
            <View style={tw``}>
                <Text>activity:</Text>
            </View>
            <View style={tw``}>{userIsAdmin ? <OfflineDatabase /> : ''}</View>
        </View>
    );
};

export default Footer;
