import {useNavigate} from 'react-router-dom';

const AdminPanelLeftMenuNagivation = props => {
    const navigate = useNavigate();
    const path = props.path;
    const name = props.name;

    const handleNavigation = path => {
        return navigate(path);
    };
    return (
        <h3
            onClick={() => {
                handleNavigation(path);
            }}>
            {name}
        </h3>
    );
};

export default AdminPanelLeftMenuNagivation;
