import React, { useContext } from "react";
import { IdentityContext } from "../../../src/identity/contexts/IdentityContext";
import AuthMenu from "./AuthMenu";
import {View} from "react-native-windows";

const AuthNotLoggedIn = () => {
    const identityContext = useContext(IdentityContext);
    const {
        userEmail,
        userPassword,
        handleUserEmail,
        handleUserPassword,
        login,
    } = identityContext;
    return (
        <View>
            <AuthMenu loggedIn={false} />
        </View>
        // <div className="md:flex w-full rounded ">
        //     <div className="md:w-full bg-blue-500 py-24 rounded-b md:rounded-lg">
        //         <AuthMenu loggedIn={false} />
        //     </div>
        // </div>
    );
};

export default AuthNotLoggedIn;

