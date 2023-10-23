import {NativeRouter, Route, Routes} from 'react-router-native';
import RequireAuth from '../src_shared/identity/utils/RequireAuth';
import PasswordBrokerRouter from './passwordBroker/routers/PasswordBrokerRouter';
import IdentityRouter from './identity/routers/IdentityRouter';
import React, {useContext} from 'react';
import AppContext from './AppContext';
import {AppTokensService} from '../src_shared/utils/native/AppTokensService';
import IdentityContextProvider from '../src_shared/identity/contexts/IdentityContextProvider';
import UserApplicationContextProvider from '../src_shared/identity/contexts/UserApplicationContextProvider';

const AppRouter = () => {
    const {hostURL, getClientId} = useContext(AppContext);

    return (
        <NativeRouter>
            <IdentityContextProvider
                hostURL={hostURL}
                tokenMode={true}
                getClientId={getClientId}
                AppTokensService={new AppTokensService()}>
                <UserApplicationContextProvider getClientId={getClientId} hostURL={hostURL}>
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
        </NativeRouter>
    );
};

export default AppRouter;
