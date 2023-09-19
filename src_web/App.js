import './css/tailwind.css';
import axios from 'axios';
import AppRouter from './AppRouter';
import React from 'react';
import AppContextProvider from './AppContextProvider';
//style="([^"]*)"
//style={tw`$1`}

axios.defaults.withCredentials = true;
function App() {
    return (
        <div className="flex h-screen w-full justify-center bg-slate-600">
            <AppContextProvider>
                <AppRouter />
            </AppContextProvider>
        </div>
    );
}

export default App;
