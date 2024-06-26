import {NativeRouter, Route, Routes} from 'react-router-native';
import RequireAuth from '../src_shared/identity/utils/RequireAuth';
import PasswordBrokerRouter from './passwordBroker/routers/PasswordBrokerRouter';
import IdentityRouter from './identity/routers/IdentityRouter';
import React, {useContext} from 'react';
import AppContext from './AppContext';
import IdentityContextProvider from '../src_shared/identity/contexts/IdentityContextProvider';
import UserApplicationContextProvider from '../src_shared/identity/contexts/UserApplicationContextProvider';
import GlobalContextProvider from '../src_shared/common/contexts/GlobalContextProvider';

const AppRouter = () => {
    const {hostURL, getClientId, offlineDatabaseService, appTokensService} = useContext(AppContext);
    return (
        <NativeRouter>
            <GlobalContextProvider>
                <IdentityContextProvider
                    hostURL={hostURL}
                    tokenMode={true}
                    getClientId={getClientId}
                    appTokensService={appTokensService}
                    AppContext={AppContext}>
                    <UserApplicationContextProvider
                        getClientId={getClientId}
                        hostURL={hostURL}
                        offlineDatabaseService={offlineDatabaseService}>
                        <Routes>
                            <Route
                                path={'/*'}
                                element={
                                    <RequireAuth>
                                        <PasswordBrokerRouter />
                                    </RequireAuth>
                                }
                            />
                            <Route path="/identity/*" element={<IdentityRouter />} />
                        </Routes>
                    </UserApplicationContextProvider>
                </IdentityContextProvider>
            </GlobalContextProvider>
        </NativeRouter>
    );
};

export default AppRouter;
