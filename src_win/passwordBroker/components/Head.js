import React, {useContext} from 'react';
import IdentityContext from '../../../src_shared/identity/contexts/IdentityContext';
import PasswordBrokerContext from '../../../src_shared/passwordBroker/contexts/PasswordBrokerContext';
import {
    MASTER_PASSWORD_FILLED_IN,
    MASTER_PASSWORD_INVALID,
    MASTER_PASSWORD_IS_EMPTY,
    MASTER_PASSWORD_VALIDATED,
} from '../../../src_shared/passwordBroker/constants/MasterPasswordStates';
import {Text, TouchableOpacity, View} from 'react-native-windows';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import tw from 'twrnc';
// import {Link} from 'react-router-native';
import {useNavigate} from 'react-router-dom';
import Search from './Search';
import UserApplicationContext from '../../../src_shared/identity/contexts/UserApplicationContext';
import {DATABASE_MODE_OFFLINE} from '../../../src_shared/identity/constants/DatabaseModeStates';

const Head = () => {
    const {databaseMode} = useContext(UserApplicationContext);
    const identityContext = useContext(IdentityContext);
    const {userName} = identityContext;
    const passwordBrokerContext = useContext(PasswordBrokerContext);
    const {masterPasswordState /*, showMasterPasswordModal*/} = passwordBrokerContext;
    const navigateFunction = useNavigate();

    const logoutClickHandler = () => {
        navigateFunction('/identity/logout');
    };

    let masterPasswordIcon = <View />;
    let masterPasswordIconClickHandler = () => {};

    switch (masterPasswordState) {
        default:
        case MASTER_PASSWORD_IS_EMPTY:
            masterPasswordIcon = (
                <View className="tooltip tooltip-bottom" data-tip="Master Pasword not entered">
                    <MaterialCommunityIcons name="key" size={20} color="white" />
                </View>
            );
            // masterPasswordIconClickHandler = () => {showMasterPasswordModal()}
            break;
        case MASTER_PASSWORD_FILLED_IN:
            masterPasswordIcon = (
                <View className="tooltip tooltip-bottom" data-tip="Master Pasword entered">
                    <MaterialCommunityIcons name="key" size={20} color="yellow" />
                </View>
            );
            break;
        case MASTER_PASSWORD_INVALID:
            masterPasswordIcon = (
                <View className="tooltip tooltip-bottom" data-tip="Master Pasword is incorrect">
                    <MaterialCommunityIcons name="key" size={20} color="red" />
                </View>
            );
            // masterPasswordIconClickHandler = () => {showMasterPasswordModal()}
            break;
        case MASTER_PASSWORD_VALIDATED:
            masterPasswordIcon = (
                <View className="tooltip tooltip-bottom" data-tip="Master Pasword validated">
                    <MaterialCommunityIcons name="key" size={20} color="#a3e635" />
                </View>
            );
            break;
    }

    return (
        <View style={tw`bg-slate-700 text-slate-300 px-2 w-full flex flex-row justify-between`}>
            <View style={tw`flex justify-start px-5 py-2`}>
                <Text style={tw`text-3xl`}>PasswordBroker</Text>
            </View>
            <View style={tw`flex justify-around px-5`}>
                <View style={tw`p-0 font-bold flex flex-row`}>
                    {databaseMode === DATABASE_MODE_OFFLINE ? (
                        ''
                    ) : (
                        <View style={tw`px-2`}>
                            <Search />
                        </View>
                    )}

                    <View style={tw`py-1`}>
                        <TouchableOpacity
                            onPress={() => {
                                masterPasswordIconClickHandler;
                            }}
                            style={tw`px-2`}>
                            {masterPasswordIcon}
                        </TouchableOpacity>
                    </View>
                    <View style={tw`py-1`}>
                        <Text style={tw`px-2`}>{userName}</Text>
                    </View>
                    <View style={tw`py-1`}>
                        <TouchableOpacity onPress={logoutClickHandler}>
                            <Text>logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default Head;
