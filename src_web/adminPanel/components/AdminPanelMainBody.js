import AdminPanelLeftMenu from "./AdminPanelLeftMenu"
import AdminPanelRightMenu from "./AdminPanelRightMenu"

const AdminPanelMainBody = (props) => {

    return (
        <main className="mb-auto flex flex-wrap flex-row flex-grow">
            <AdminPanelLeftMenu />
            <AdminPanelRightMenu>
                {props.children}
            </AdminPanelRightMenu>
        </main>
    )
}

export default AdminPanelMainBody