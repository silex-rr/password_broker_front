import React from "react";

const AppContext = React.createContext()

const AppProvider = (props) => {
    const hostName = 'http://dev-back.jrvs.ru'


    return (
        <AppContext.Provider
            value={{
                hostName: hostName
            }}
            >
            {props.children}
        </AppContext.Provider>
    )
}

export {AppContext, AppProvider}