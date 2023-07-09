import './css/tailwind.css'
import {IdentityProvider} from "./identity/contexts/IdentityContext"
import AuthContainer from "./identity/components/AuthContainer"
import {BrowserRouter, Route, Routes,} from "react-router-dom";
import RequireAuth from "./identity/components/RequireAuth";
import PasswordBrokerRouter from "./passwordBroker/routers/PasswordBrokerRouter";

function App() {

    return (
        <div className="flex w-full justify-center bg-slate-600 h-screen">
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
    )

}

export default App;
