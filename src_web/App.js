import './css/tailwind.css'
import {IdentityProvider} from "../src_shared/identity/contexts/IdentityContext"
import AuthContainer from "./identity/components/AuthContainer"
import {BrowserRouter, Route, Routes,} from "react-router-dom";
import RequireAuth from "../src_shared/identity/utils/RequireAuth";
import PasswordBrokerRouter from "./passwordBroker/routers/PasswordBrokerRouter";
import axios from "axios";

axios.defaults.withCredentials = true;
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
