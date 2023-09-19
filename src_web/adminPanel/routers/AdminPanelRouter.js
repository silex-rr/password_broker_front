import {Route, Routes} from "react-router"
import AdminPanelContainer from "../components/AdminPanelContainer"
import UserControl from "../components/user_control/UserControl"
import AdminSettings from '../components/settings/AdminSettings'
import Logs from "../components/logs/Logs"
import AppContext from "../../AppContext"
import PasswordBrokerContextProvider from "../../../src_shared/passwordBroker/contexts/PasswordBrokerContextProvider"
import {AdminPanelProvider} from "../contexts/AdminPanelContext";

const AdminPanelRouter = (props) => {
    return (
        <AdminPanelProvider>
            <PasswordBrokerContextProvider AppContext={AppContext}>
                <Routes>
                    <Route
                        path="/*"
                        element={<AdminPanelContainer/>}
                    />
                    <Route
                        path="/user_control/*"
                        element={<AdminPanelContainer><UserControl/></AdminPanelContainer>}
                    />
                    <Route
                        path="/settings/*"
                        element={<AdminPanelContainer><AdminSettings/></AdminPanelContainer>}
                    />
                    <Route
                        path="/logs/*"
                        element={<AdminPanelContainer><Logs/></AdminPanelContainer>}
                    />
                </Routes>
            </PasswordBrokerContextProvider>
        </AdminPanelProvider>
    )
}

export default AdminPanelRouter
