import {useNavigate} from 'react-router-dom';
import React, {useContext, useEffect} from 'react';
import IdentityContext from '../../../src_shared/identity/contexts/IdentityContext';
import UserApplicationContext from '../../../src_shared/identity/contexts/UserApplicationContext';

const AuthLogout = () => {
    const identityContext = useContext(IdentityContext);
    const {databaseMode, userApplicationUnload} = useContext(UserApplicationContext);
    const navigate = useNavigate();
    const {logout} = identityContext;
    useEffect(() => {
        logout(navigate, databaseMode).then(() => {
            userApplicationUnload();
            navigate('/');
        });
    }, [navigate, logout, databaseMode, userApplicationUnload]);
    return (
        <div className="w-full rounded md:flex ">
            <div className="rounded-lg bg-white px-12 py-24">
                <div className="font-inter_extrabold mb-8 text-center text-4xl text-blue-500">Logout</div>
            </div>
        </div>
    );
};

export default AuthLogout;
