import React, { useContext, useState } from "react";
import { IdentityContext } from "../../../src/identity/contexts/IdentityContext";
import { MdEmail } from "react-icons/md";
import { GoKey } from "react-icons/go";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import {Navigate, useNavigate} from "react-router-dom";
import {LOGGED_IN} from "../../../src/identity/constants/AuthStatus";
import {Text, TextInput, View, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native-windows";
import tw from "twrnc"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const AuthLogin = () => {
    let navigate = useNavigate();
    const {
        userEmail,
        userPassword,
        handleUserEmail,
        handleUserPassword,
        login,
        errorMessage,
        authStatus
    } = useContext(IdentityContext)

    if (authStatus === LOGGED_IN) {
        return (<Navigate to="/" replace />)
    }
    return (
        <View style={tw`flex rounded`}>
            <View style={tw`bg-slate-200 py-24 px-12 rounded-lg`}>
                <View style={tw`mb-8`}>
                    <Text style={tw`text-4xl text-slate-700 text-center`}>Login</Text>
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
                    <TouchableOpacity onPress={() => login()}>
                        <Text style={tw`text-slate-700 text-center rounded py-2 px-10 border border-slate-700 `}>Login</Text>
                    </TouchableOpacity>
                </View>
                <Text style={tw`w-full text-red-600 text-center mt-8`}>{errorMessage}</Text>

            </View>
        </View>

        // <div className="md:flex w-full rounded ">
        //     <div className="bg-slate-200 py-24 px-12 rounded-lg">
        //         <div className="font-inter_extrabold text-4xl text-slate-700 text-center mb-8">
        //             Login
        //         </div>
        //         {/* EMAIL */}
        //         <div className="grid grid-cols-7 w-full mb-4">
        //             <div className="col-span-1 bg-slate-500 pt-1">
        //                 <MdEmail className="text-slate-100 text-3xl mx-auto" />
        //             </div>
        //             <div className="col-span-6">
        //                 <input
        //                     className="w-full bg-slate-300 text-slate-800 placeholder-slate-700 pl-3 py-2"
        //                     name="email"
        //                     type="text"
        //                     placeholder="Email"
        //                     value={userEmail}
        //                     onChange={handleUserEmail}
        //                 />
        //             </div>
        //         </div>
        //         {/* HIDDEN PASSWORD */}
        //         <div className={showHiddenPassword + " grid grid-cols-7 w-full"}>
        //             <div className="col-span-1 bg-slate-500 pt-1">
        //                 <GoKey className="text-slate-100 text-3xl mx-auto" />
        //             </div>
        //             <div className="col-span-5">
        //                 <input
        //                     className="w-full bg-slate-300 text-slate-800 placeholder-slate-700 pl-3 py-2"
        //                     name="password"
        //                     type="password"
        //                     placeholder="Password"
        //                     value={userPassword}
        //                     onChange={handleUserPassword}
        //                 />
        //             </div>
        //             <div className="col-span-1 bg-slate-300 text-center pt-1">
        //                 <button
        //                     className="text-slate-500 text-3xl focus:outline-none"
        //                     onClick={() => togglePassword()}
        //                 >
        //                     <FaRegEye />
        //                 </button>
        //             </div>
        //         </div>
        //         {/* REVEALED PASSWORD */}
        //         <div className={showRevealedPassword + " grid grid-cols-7 w-full"}>
        //             <div className="col-span-1 bg-slate-500 pt-1">
        //                 <GoKey className="text-white text-3xl mx-auto" />
        //             </div>
        //             <div className="col-span-5">
        //                 <input
        //                     className="w-full bg-slate-300 placeholder-slate-800 pl-3 py-2"
        //                     name="password"
        //                     type="text"
        //                     placeholder="Password"
        //                     value={userPassword}
        //                     onChange={handleUserPassword}
        //                 />
        //             </div>
        //             <div className="col-span-1 bg-slate-300 text-center pt-1">
        //                 <button
        //                     className="text-slate-500 text-3xl focus:outline-none"
        //                     onClick={() => togglePassword()}
        //                 >
        //                     <FaRegEyeSlash />
        //                 </button>
        //             </div>
        //         </div>
        //         {/* SUBMIT BUTTON */}
        //         <div className="flex justify-center w-full mt-12">
        //             <button
        //                 className="font-inter_bold hover:bg-slate-700 text-slate-700 hover:text-white
        //                     text-center rounded py-2 px-10 border border-slate-700 focus:outline-none"
        //                 onClick={() => login()}
        //             >
        //                 Login
        //             </button>
        //         </div>
        //         <div className="w-full text-red-600 text-center mt-8">
        //             {errorMessage}
        //         </div>
        //     </div>
        //     {/*<div className="md:w-1/2 bg-slate-500 py-24 rounded-b-lg md:rounded-r-lg  md:rounded-l-none">*/}
        //     {/*    <AuthMenu loggedIn={false} />*/}
        //     {/*</div>*/}
        // </div>
    );
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    labelContainer: {
        backgroundColor: "white", // Same color as background
        alignSelf: "flex-start", // Have View be same width as Text inside
        paddingHorizontal: 3, // Amount of spacing between border and first/last letter
        marginStart: 10, // How far right do you want the label to start
        zIndex: 1, // Label must overlap border
        elevation: 1, // Needed for android
        shadowColor: "white", // Same as background color because elevation: 1 creates a shadow that we don't want
        position: "absolute", // Needed to be able to precisely overlap label with border
        top: -12, // Vertical position of label. Eyeball it to see where label intersects border.
    },
    inputContainer: {
        borderWidth: 1, // Create border
        borderRadius: 8, // Not needed. Just make it look nicer.
        padding: 8, // Also used to make it look nicer
        zIndex: 0, // Ensure border has z-index of 0
    },
});

export default AuthLogin;
