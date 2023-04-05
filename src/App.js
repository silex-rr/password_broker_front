import './css/tailwind.css'
import {IdentityProvider} from "./identity/contexts/IdentityContext"
import AuthContainer from "./identity/components/AuthContainer"
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    useNavigate,
    useLocation,
    Navigate,
    Outlet,
} from "react-router-dom";
import RequireAuth from "./identity/components/RequireAuth";
import {useEffect} from "react";
import PasswordBrokerRouter from "./passwordBroker/routers/PasswordBrokerRouter";

function App() {

    return (
        <div className="flex w-full justify-center bg-slate-600 h-screen">
            <div className="flex w-full">
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
                    </Routes>
                </BrowserRouter>
            </div>
        </div>
    )

}

export default App;
