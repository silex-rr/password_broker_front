import React, {useContext, useEffect} from "react";
import {IdentityContext} from "../contexts/IdentityContext";
import {LOG_IN_FORM, LOGGED_IN, SIGN_UP_FORM} from "../constants/AuthStatus";
import {Navigate, useLocation} from "react-router-dom";


const AuthLoading = ({ children }: { children: JSX.Element }) => {
    const location = useLocation()
    const identityContext = useContext(IdentityContext)

    const { getUser, authStatus} = identityContext

    useEffect( () => {
        // console.log('AuthLoading-useEffect', authStatus, Math.random())
        if (authStatus === "") {
            getUser(location)
        }
    }, [authStatus]);

    // console.log('AuthLoading', authStatus, Math.random())

    switch (authStatus) {
        case LOGGED_IN:
            let path = '/'
            if (location.state.from.pathname) {
                path = location.state.from.pathname;
            }
            // console.log(path)
            return (<Navigate to={path} replace={true} />)
        case LOG_IN_FORM:
            return (<Navigate to="/identity/login" replace={true} />)
        case SIGN_UP_FORM:
            return (<Navigate to="/identity/signup" replace={true} />)
    }

    return (
        <div className="md:flex w-full rounded ">
            <div className="bg-slate-200 py-36 px-24 rounded-lg">
                <div className="font-inter_extrabold text-4xl text-slate-600 text-center mb-8">
                    Loading
                </div>
            </div>
        </div>
    );
};

export default AuthLoading;
