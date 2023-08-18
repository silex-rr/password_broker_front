import React, {useContext, useEffect} from "react";
import {IdentityContext} from "../../../src/identity/contexts/IdentityContext";
import {LOG_IN_FORM, LOGGED_IN, SIGN_UP_FORM} from "../../../src/identity/constants/AuthStatus";
import {Navigate, useLocation} from "react-router-native";
import {Text, View} from "react-native-windows";


const AuthLoading = ({ children }) => {
    const location = useLocation()
    const identityContext = useContext(IdentityContext)

    const { getUser, authStatus} = identityContext

    useEffect( () => {
        if (authStatus === "") {
            getUser(location)
        }
    }, [authStatus]);


    console.log(authStatus)
    switch (authStatus) {
        case LOGGED_IN:
            let path = '/'
            if (location.state.from.pathname) {
                path = location.state.from.pathname;
            }
            console.log(path)
            return (<Navigate to={path} replace={true} />)
        case LOG_IN_FORM:
            return (<Navigate to="/identity/login" replace={true} />)
        case SIGN_UP_FORM:
            return (<Navigate to="/identity/signup" replace={true} />)
    }

    return (
        <View>
            <Text>Loading</Text>
        </View>
    );
};

export default AuthLoading;
