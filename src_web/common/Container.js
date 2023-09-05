import Head from "../passwordBroker/components/Head";
import Footer from "../passwordBroker/components/Footer";
import MasterPasswordModal from "../passwordBroker/components/MasterPasswordModal";

const Container = (props) => {
    return (
        <div className="flex flex-col h-screen w-full">
            <Head/>
            <main className="mb-auto flex flex-wrap flex-row flex-grow">
                {props.children}
            </main>
            <Footer/>
            <MasterPasswordModal/>
        </div>
    )
}

export default Container