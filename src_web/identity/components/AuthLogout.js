import {useNavigate} from 'react-router-dom';
import React, {useContext, useEffect} from 'react';
import IdentityContext from '../../../src_shared/identity/contexts/IdentityContext';
import UserApplicationContext from '../../../src_shared/identity/contexts/UserApplicationContext';
import {DATABASE_MODE_OFFLINE} from '../../../src_shared/identity/constants/DatabaseModeStates';

const AuthLogout = () => {
    const identityContext = useContext(IdentityContext);
    const {databaseMode, switchDatabaseToOnline} = useContext(UserApplicationContext);
    const navigate = useNavigate();
    const {logout} = identityContext;
    useEffect(() => {
        logout(navigate, databaseMode);
        if (databaseMode === DATABASE_MODE_OFFLINE) {
            switchDatabaseToOnline();
        }
    }, [navigate, logout, databaseMode, switchDatabaseToOnline]);
    return (
        <div className="w-full rounded md:flex ">
            <div className="rounded-lg bg-white px-12 py-24">
                <div className="font-inter_extrabold mb-8 text-center text-4xl text-blue-500">Logout</div>
            </div>
        </div>
    );
};

export default AuthLogout;
