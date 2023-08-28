import {NativeRouter, Route, Routes} from "react-router-native";
import {IdentityProvider} from "../src_shared/identity/contexts/IdentityContext";
import RequireAuth from "../src_shared/identity/utils/RequireAuth";
import PasswordBrokerRouter from "./passwordBroker/routers/PasswordBrokerRouter";
import IdentityRouter from "./identity/routers/IdentityRouter";
import React, {useContext} from "react";
import {AppContext} from "./AppContext";
import {AppTokensService} from "../src_shared/utils/native/AppTokensService";

const AppRouter = () => {
    const {
        hostURL,
        getAppUUId
    } = useContext(AppContext)

    return (
        <NativeRouter>
            <IdentityProvider
                hostURL={hostURL}
                tokenMode={true}
                getAppUUId={getAppUUId}
                AppTokensService={new AppTokensService}
            >
                <Routes>
                    <Route path={'/*'}
                           element={
                               <RequireAuth>
                                   <PasswordBrokerRouter/>
                               </RequireAuth>
                           }
                    />
                    <Route path="/identity/*"
                           element={
                                <IdentityRouter/>
                           }
                    />
                </Routes>
            </IdentityProvider>
        </NativeRouter>
    )
}

export default AppRouter