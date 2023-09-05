import React from "react"

const AdminPanelContext = React.createContext();

const AdminPanelProvider = (props) => {

    return (
        <AdminPanelContext.Provider value={{}}>
            {props.children}
        </AdminPanelContext.Provider>
    )
}

export {AdminPanelContext, AdminPanelProvider}