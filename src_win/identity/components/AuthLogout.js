import {Navigate, useLocation, useNavigate} from "react-router-native";
import React, {useContext, useEffect} from "react";
import {IdentityContext} from "../../../src/identity/contexts/IdentityContext";
import {View, Text} from "react-native-windows";

const AuthLogout = () => {
    const identityContext = useContext(IdentityContext)
    const navigate = useNavigate();
    const { logout } = identityContext
    useEffect(() => {
            logout(navigate)
        },
        [navigate])
    return (
        <View>
            <Text>Logout</Text>
        </View>
        // <div className="md:flex w-full rounded ">
        //     <div className="bg-white py-24 px-12 rounded-lg">
        //         <div className="font-inter_extrabold text-4xl text-blue-500 text-center mb-8">
        //
        //         </div>
        //     </div>
        // </div>
    )
}

export default AuthLogout