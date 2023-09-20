import {useNavigate} from 'react-router-dom';

const UserControlNavigation = props => {
    const navigate = useNavigate();
    const path = props.path;
    const name = props.name;

    const handleNavigation = path => {
        return navigate(path);
    };

    return (
        <div
            onClick={() => {
                handleNavigation(path);
            }}>
            {name}
        </div>
    );
};

export default UserControlNavigation;
