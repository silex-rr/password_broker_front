import './css/tailwind.css'
import {IdentityProvider} from "../src_shared/identity/contexts/IdentityContext"
import AuthContainer from "./identity/components/AuthContainer"
import {BrowserRouter, Route, Routes,} from "react-router-dom";
import RequireAuth from "../src_shared/identity/utils/RequireAuth";
import PasswordBrokerRouter from "./passwordBroker/routers/PasswordBrokerRouter";
import axios from "axios";
import {AppProvider} from "./AppContext";
import AppRouter from "./AppRouter";

axios.defaults.withCredentials = true;
function App() {

    return (
        <div className="flex w-full justify-center bg-slate-600 h-screen">
            <AppProvider>
                <AppRouter />
            </AppProvider>
        </div>
    )

}

export default App;
