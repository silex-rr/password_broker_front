import MainLeftMenu from "./MainLeftMenu";
import MainBody from "./MainBody/MainBody";

const Main = (props) => {
    return (
        <main className="mb-auto flex flex-row h-full">
            <MainLeftMenu/>
            <MainBody/>
        </main>
    )
}

export default Main