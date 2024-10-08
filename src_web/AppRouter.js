import {BrowserRouter, Route, Routes} from 'react-router-dom';
import RequireAuth from '../src_shared/identity/utils/RequireAuth';
import PasswordBrokerRouter from './passwordBroker/routers/PasswordBrokerRouter';
import AuthContainer from './identity/components/AuthContainer';
import AdminPanelRouter from './adminPanel/routers/AdminPanelRouter';
import React from 'react';
import {ToastContainer} from 'react-toastify';
import IdentityContextProvider from '../src_shared/identity/contexts/IdentityContextProvider';
import UserApplicationContextProvider from '../src_shared/identity/contexts/UserApplicationContextProvider';
import AppContext from './AppContext';
import GlobalContextProvider from '../src_shared/common/contexts/GlobalContextProvider';
import 'react-toastify/dist/ReactToastify.css';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <GlobalContextProvider>
                <IdentityContextProvider AppContext={AppContext}>
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
                <ToastContainer
                    position="bottom-left"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                    bodyClassName="text-slate-200 "
                    toastClassName="!bg-slate-700"
                    progressClassName="bg-slate-400"
                />
            </GlobalContextProvider>
        </BrowserRouter>
    );
};

export default AppRouter;
