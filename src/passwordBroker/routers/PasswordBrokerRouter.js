import {Route, Routes} from "react-router-dom";
import PasswordBrokerContainer from "../components/PasswordBrokerContainer";
import {PasswordBrokerProvider} from "../contexts/PasswordBrokerContext";

const PasswordBrokerRouter = () => {
    return (
        <Routes>
            <Route
                path="/entryGroup/:entryGroupId"
                element={
                    <PasswordBrokerProvider>
                        <PasswordBrokerContainer/>
                    </PasswordBrokerProvider>
                }
            />
            <Route
                path="/"
                element={
                    <PasswordBrokerProvider>
                        <PasswordBrokerContainer/>
                    </PasswordBrokerProvider>
                }
            />
        </Routes>
    )
}

export default PasswordBrokerRouter