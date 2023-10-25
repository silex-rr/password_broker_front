import {BrowserRouter, Route, Routes} from 'react-router-dom';
import RequireAuth from '../src_shared/identity/utils/RequireAuth';
import PasswordBrokerRouter from './passwordBroker/routers/PasswordBrokerRouter';
import AuthContainer from './identity/components/AuthContainer';
import AdminPanelRouter from './adminPanel/routers/AdminPanelRouter';
import React from 'react';
import IdentityContextProvider from '../src_shared/identity/contexts/IdentityContextProvider';
import UserApplicationContextProvider from '../src_shared/identity/contexts/UserApplicationContextProvider';
const AppRouter = () => {
    return (
        <BrowserRouter>
            <IdentityContextProvider>
                <UserApplicationContextProvider>
                    <Routes>
                        <Route
                            path="/*"
                            element={
                                <RequireAuth>
                                    <PasswordBrokerRouter />
                                </RequireAuth>
                            }
                        />
                        <Route path="/identity/*" element={<AuthContainer />} />
                        <Route
                            path="/admin/*"
                            element={
                                <RequireAuth>
                                    <AdminPanelRouter />
                                </RequireAuth>
                            }
                        />
                    </Routes>
                </UserApplicationContextProvider>
            </IdentityContextProvider>
        </BrowserRouter>
    );
};

export default AppRouter;
