import AdminPanelLeftMenu from './AdminPanelLeftMenu';
import AdminPanelRightMenu from './AdminPanelRightMenu';

const AdminPanelMainBody = props => {
    return (
        <main className="mb-auto flex flex-grow flex-row flex-wrap">
            <AdminPanelLeftMenu />
            <AdminPanelRightMenu>{props.children}</AdminPanelRightMenu>
        </main>
    );
};

export default AdminPanelMainBody;
