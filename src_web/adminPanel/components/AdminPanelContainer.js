import Container from '../../common/Container';
import AdminPanelMainBody from './AdminPanelMainBody';
const AdminPanelContainer = props => {
    return (
        <Container>
            <AdminPanelMainBody>{props.children}</AdminPanelMainBody>
        </Container>
    );
};

export default AdminPanelContainer;
