import React, { useContext } from "react";
import { IdentityContext } from "../contexts/IdentityContext";
import AuthMenu from "./AuthMenu";

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
        <div className="md:flex w-full rounded ">
            <div className="md:w-full bg-blue-500 py-24 rounded-b md:rounded-lg">
                <AuthMenu loggedIn={false} />
            </div>
        </div>
    );
};

export default AuthNotLoggedIn;

