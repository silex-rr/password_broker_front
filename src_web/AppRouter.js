import {BrowserRouter, Route, Routes} from "react-router-dom";
import {IdentityProvider} from "../src_shared/identity/contexts/IdentityContext";
import RequireAuth from "../src_shared/identity/utils/RequireAuth";
import PasswordBrokerRouter from "./passwordBroker/routers/PasswordBrokerRouter";
import AuthContainer from "./identity/components/AuthContainer";
import AdminPanelRouter from "./adminPanel/routers/AdminPanelRouter";

const AppRouter = () => {
    return (
        <IdentityProvider>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/*"
                        element={
                            <RequireAuth>
                                <PasswordBrokerRouter/>
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/identity/*"
                        element={
                            <AuthContainer/>
                        }
                    />
                    <Route
                        path="/admin/*"
                        element={
                            <RequireAuth>
                                <AdminPanelRouter/>
                            </RequireAuth>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </IdentityProvider>
    )
}

export default AppRouter