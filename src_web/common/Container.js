import Head from "./Head";
import Footer from "./Footer";
import MasterPasswordModal from "./MasterPasswordModal";

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