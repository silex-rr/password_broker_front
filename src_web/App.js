import './css/tailwind.css';
import AppRouter from './AppRouter';
import React from 'react';
import AppContextProvider from './AppContextProvider';

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
