import React from 'react';
import {useNavigate} from 'react-router-dom';

const AdminPanelLeftMenuNagivation = props => {
    console.log(props);
    const navigate = useNavigate();
    const path = props.path;
    const name = props.name;
    const selectedItem = props.selectedItem;

    const selectedMenuItem = path === selectedItem ? 'font-bold pl-2' : '';

    const handleNavigation = path => {
        return navigate(path);
    };
    return (
        <h3
            className={`${selectedMenuItem}`}
            onClick={() => {
                handleNavigation(path);
            }}>
            {name}
        </h3>
    );
};

export default AdminPanelLeftMenuNagivation;
