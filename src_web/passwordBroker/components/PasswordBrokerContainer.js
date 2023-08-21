import Head from "./Head";
import Main from "./Main";
import Footer from "./Footer";
import MasterPasswordModal from "./MasterPasswordModal";

const PasswordBrokerContainer = () => {
    return (
        <div className="flex flex-col h-screen w-full">
            <Head/>
            <Main/>
            <Footer/>
            <MasterPasswordModal/>
        </div>
    )
}

export default PasswordBrokerContainer