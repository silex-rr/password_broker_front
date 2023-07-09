import MainLeftMenu from "./MainLeftMenu";
import MainBody from "./MainBody/MainBody";

const Main = (props) => {
    return (
        <main className="mb-auto flex flex-wrap flex-row flex-grow">
            <MainLeftMenu/>
            <MainBody/>
        </main>
    )
}

export default Main