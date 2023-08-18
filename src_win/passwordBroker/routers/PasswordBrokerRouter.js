import {Route, Routes} from "react-router-native";
import {PasswordBrokerProvider} from "../../../../src/passwordBroker/contexts/PasswordBrokerContext";
import PBTest from "../components/PBTest";

const PasswordBrokerRouter = () => {
    return (
        <Routes>
            <Route
                path="/entryGroup/:entryGroupId"
                element={
                        <PBTest />
                }
            />
        </Routes>
    )
}

export default PasswordBrokerRouter