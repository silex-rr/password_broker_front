import React, {useContext} from "react";
import {IdentityContext} from "../../../src_shared/identity/contexts/IdentityContext";
import {Text, TextInput, TouchableOpacity, View} from "react-native-windows";
import tw from "twrnc";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const AuthSignup = () => {
    const {
        userNameInput,
        userEmail,
        userPassword,
        handleUserNameInput,
        handleUserEmail,
        handleUserPassword,
        signup,
        errorMessage,
    } = useContext(IdentityContext);

    return (
        <React.Fragment>
            <View style={tw`mb-8`}>
                <Text style={tw`text-4xl text-slate-700 text-center`}>Signup</Text>
            </View>

            <View style={tw`mb-4 flex flex-row`}>
                <View style={tw`bg-slate-500 pt-1 basis-1/6 items-center`}>
                    <MaterialIcons name="person" size={28} color="white" />
                </View>
                <View style={tw` basis-5/6`}>
                    <TextInput
                        style={tw`w-full bg-slate-300 text-slate-800 pl-3 py-2`}
                        placeholder="User Name"
                        placeholderTextColor="#64748b"
                        onChangeText={handleUserNameInput}
                        value={userNameInput}
                    />
                </View>
            </View>

            <View style={tw`mb-4 flex flex-row`}>
                <View style={tw`bg-slate-500 pt-1 basis-1/6 items-center`}>
                    <MaterialCommunityIcons name="email" size={28} color="white" />
                </View>
                <View style={tw` basis-5/6`}>
                    <TextInput
                        style={tw`w-full bg-slate-300 text-slate-800 pl-3 py-2`}
                        placeholder="Email"
                        placeholderTextColor="#64748b"
                        onChangeText={handleUserEmail}
                        value={userEmail}
                    />
                </View>
            </View>

            <View style={tw`mb-4 flex flex-row`}>
                <View style={tw`bg-slate-500 pt-1 basis-1/6 items-center`}>
                    <MaterialCommunityIcons name="key-variant" size={28} color="white" />
                </View>
                <View style={tw`basis-5/6`}>
                    <TextInput
                        style={tw`w-full bg-slate-300 text-slate-800 pl-3 py-2 hover:bg-slate-300`}
                        placeholder="Password"
                        placeholderTextColor="#64748b"
                        secureTextEntry={true}
                        onChangeText={handleUserPassword}
                        value={userPassword}
                    />
                </View>
            </View>

            <View style={tw`flex justify-center w-full mt-12`}>
                <TouchableOpacity onPress={() => signup()}>
                    <Text style={tw`text-slate-700 text-center rounded py-2 px-10 border border-slate-700 `}>Signup</Text>
                </TouchableOpacity>
            </View>

            <View>
                <Text style={tw`w-full text-red-600 text-center mt-8`}>{errorMessage}</Text>
            </View>

        </React.Fragment>
    );
};

export default AuthSignup;

