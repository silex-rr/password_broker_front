import {NativeRouter, Route, Routes} from 'react-router-native';
import RequireAuth from '../src_shared/identity/utils/RequireAuth';
import PasswordBrokerRouter from './passwordBroker/routers/PasswordBrokerRouter';
import IdentityRouter from './identity/routers/IdentityRouter';
import React, {useContext} from 'react';
import AppContext from './AppContext';
import {AppTokensService} from '../src_shared/utils/native/AppTokensService';
import IdentityContextProvider from '../src_shared/identity/contexts/IdentityContextProvider';

const AppRouter = () => {
    const {hostURL, getAppUUId} = useContext(AppContext);

    return (
        <NativeRouter>
            <IdentityContextProvider
                hostURL={hostURL}
                tokenMode={true}
                getAppUUId={getAppUUId}
                AppTokensService={new AppTokensService()}>
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
            </IdentityContextProvider>
        </NativeRouter>
    );
};

export default AppRouter;
