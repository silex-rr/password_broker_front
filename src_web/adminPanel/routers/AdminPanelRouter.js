import { Route, Routes } from 'react-router';
import AdminPanelContainer from '../components/AdminPanelContainer';
import UserControl from '../components/user_control/UserControl';
import AdminSettings from '../components/settings/AdminSettings';
import Logs from '../components/logs/Logs';
import AppContext from '../../AppContext';
import PasswordBrokerContextProvider from '../../../src_shared/passwordBroker/contexts/PasswordBrokerContextProvider';
import { AdminPanelProvider } from '../contexts/AdminPanelContext';
import UserUpdate from '../components/user_control/UserUpdate';
import UserApplicationContext from '../../../src_shared/identity/contexts/UserApplicationContext';
import React from 'react';
import Backup from '../components/backup/Backup';
const AdminPanelRouter = () => {
    return (
        <AdminPanelProvider>
            <PasswordBrokerContextProvider AppContext={AppContext} UserApplicationContext={UserApplicationContext}>
                <Routes>
                    <Route path="/*" element={<AdminPanelContainer />} />
                    <Route
                        path="/user_control/*"
                        element={
                            <AdminPanelContainer>
                                <UserControl />
                            </AdminPanelContainer>
                        }
                    />
                    <Route
                        path="/user_control/update/:userID"
                        element={
                            <AdminPanelContainer>
                                <UserUpdate />
                            </AdminPanelContainer>
                        }
                    />
                    <Route
                        path="/settings/*"
                        element={
                            <AdminPanelContainer>
                                <AdminSettings />
                            </AdminPanelContainer>
                        }
                    />
                    <Route
                        path="/logs/*"
                        element={
                            <AdminPanelContainer>
                                <Logs />
                            </AdminPanelContainer>
                        }
                    />
                    <Route
                        path="/backup/*"
                        element={
                            <AdminPanelContainer>
                                <Backup />
                            </AdminPanelContainer>
                        }
                    />
                </Routes>
            </PasswordBrokerContextProvider>
        </AdminPanelProvider>
    );
};

export default AdminPanelRouter;
