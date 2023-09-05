import {BrowserRouter, Route, Routes} from "react-router-dom";
import {IdentityProvider} from "../src_shared/identity/contexts/IdentityContext";
import RequireAuth from "../src_shared/identity/utils/RequireAuth";
import PasswordBrokerRouter from "./passwordBroker/routers/PasswordBrokerRouter";
import AuthContainer from "./identity/components/AuthContainer";
import { AdminPanelProvider } from "./adminPanel/contexts/AdminPanelContext";
import AdminPanelRouter from "./adminPanel/routers/AdminPanelRouter";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/*"
                    element={
                        <IdentityProvider>
                            <RequireAuth>
                                <PasswordBrokerRouter/>
                            </RequireAuth>
                        </IdentityProvider>
                    }
                />
                <Route
                    path="/identity/*"
                    element={
                        <IdentityProvider>
                            <AuthContainer/>
                        </IdentityProvider>
                    }
                />
                <Route 
                    path="/admin/*"
                    element={
                        <IdentityProvider>
                            <RequireAuth>
                                <AdminPanelProvider>
                                    <AdminPanelRouter />
                                </AdminPanelProvider>
                            </RequireAuth>
                        </IdentityProvider>
                    }
                 />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter