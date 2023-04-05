import {useContext} from "react";
import {PasswordBrokerContext} from "../contexts/PasswordBrokerContext";
import Head from "./Head";
import Main from "./Main";
import Footer from "./Footer";
import {IdentityContext} from "../../identity/contexts/IdentityContext";

const PasswordBrokerContainer = () => {
    const passwordBrokerContext = useContext(PasswordBrokerContext)
    const identityContext = useContext(IdentityContext)
    const { userName } = identityContext
    return (
        <div className="flex flex-col h-screen justify-between w-full">
            <Head userName={userName}/>
            <Main/>
            <Footer/>
        </div>
    )
}

export default PasswordBrokerContainer