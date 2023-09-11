import './css/tailwind.css'
import axios from "axios";
import {AppProvider} from "./AppContext";
import AppRouter from "./AppRouter";

//style="([^"]*)"
//style={tw`$1`}

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
