import React, {useContext, useState} from "react"
import {PasswordBrokerContext} from "../../../src_shared/passwordBroker/contexts/PasswordBrokerContext";
import {ActivityIndicator, Pressable, Text, TextInput, View} from "react-native-windows";
import tw from "twrnc";
import {ENTRY_GROUP_ADDING_AWAIT} from "../../../src_shared/passwordBroker/constants/EntryGroupAddingStates";
import {AppContext} from "../../AppContext";

const MasterPasswordModal = () => {
    const passwordBrokerContext = useContext(PasswordBrokerContext)
    const {
        masterPasswordModalVisibilityErrorRef,
        memorizeMasterPassword,
    } = passwordBrokerContext
    const {

    } = useContext(AppContext)

    const {
        modalClose
    } = useContext(AppContext)

    const [masterPasswordField, setMasterPasswordField] = useState('')

    const handleMasterPasswordField = (v) => {
        setMasterPasswordField(v)
    }

    const handleSaveMasterPassword = () => {
        memorizeMasterPassword(masterPasswordField)
        setMasterPasswordField('')
    }


    return (
        <View style={tw`w-full`}>
            <Text style={tw`text-lg font-bold`}>Enter your Master Password</Text>
            <View style={tw`pt-4`}>
                <TextInput id="masterPasswordInput"
                   value={masterPasswordField}
                   secureTextEntry={true}
                   onChangeText={handleMasterPasswordField}
                   autoFocus={true}
                   placeholder="type your MasterPassword"
                   style={tw`bg-slate-800 text-slate-200 placeholder-slate-300 w-full`}
                   onKeyPress={(e)=>
                    {if (e.nativeEvent.key === "Enter") {handleSaveMasterPassword()}}}
                   onSubmitEditing={handleSaveMasterPassword}
                />
            </View>

            <View style={tw`flex flex-row justify-around w-full mt-10`}>
                <Pressable onPress={handleSaveMasterPassword}
                           style={{...tw`rounded py-2 px-10 w-1/3`, backgroundColor: '#36d399'}}>
                    <View>
                        <Text style={tw`text-slate-700 text-center w-full font-bold`}>Remember</Text>
                    </View>
                </Pressable>
                <Pressable
                    onPress={modalClose} style={tw`rounded py-2 px-10 border border-red-400 w-1/3`}>
                    <Text
                        style={tw`text-red-400 text-center w-full`}
                    >CLOSE</Text>
                </Pressable>
            </View>
            <View ref={masterPasswordModalVisibilityErrorRef} style={tw`w-full bg-red-700 text-slate-100 text-center`}>

            </View>
        </View>
    )
}

export default MasterPasswordModal