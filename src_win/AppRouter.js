import {NativeRouter, Route, Routes} from "react-router-native";
import {IdentityProvider} from "../src/identity/contexts/IdentityContext";
import RequireAuth from "../src/identity/components/RequireAuth";
import PasswordBrokerRouter from "./passwordBroker/routers/PasswordBrokerRouter";
import IdentityRouter from "./identity/routers/IdentityRouter";
import React, {useContext} from "react";
import {AppContext} from "./AppContext";

const AppRouter = () => {
    const {
        hostName
    } = useContext(AppContext)

    return (
        <NativeRouter>
            <Routes>
                <Route path={'/*'}
                       element={
                           <IdentityProvider hostName={hostName}>
                               <RequireAuth>
                                   <PasswordBrokerRouter/>
                               </RequireAuth>
                           </IdentityProvider>
                       }
                />
                <Route path="/identity/*"
                       element={
                           <IdentityProvider  hostName={hostName}>
                               <IdentityRouter/>
                           </IdentityProvider>
                       }
                />
            </Routes>
        </NativeRouter>
    )
}

export default AppRouter