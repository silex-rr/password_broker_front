import {Navigate, useLocation} from "react-router-dom";
import React, {useContext} from "react";
import {IdentityContext} from "../contexts/IdentityContext";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
    const location = useLocation()
    const identityContext = useContext(IdentityContext)
    const { userId } = identityContext
    console.log('userId: ' + userId)
    if (userId === "") {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/identity/loading" state={{ from: location }} replace />
    }

    return children
}

export default RequireAuth