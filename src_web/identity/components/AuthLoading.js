import React, {useContext, useEffect} from 'react';
import IdentityContext from '../../../src_shared/identity/contexts/IdentityContext';
import {
    INITIAL_RECOVERY,
    LOG_IN_FORM,
    LOGGED_IN,
    SIGN_UP_FORM,
} from '../../../src_shared/identity/constants/AuthStatus';
import {Navigate, useLocation} from 'react-router-dom';

const AuthLoading = () => {
    const location = useLocation();
    const identityContext = useContext(IdentityContext);

    const {getUser, authStatus} = identityContext;

    useEffect(() => {
        // console.log('AuthLoading-useEffect', authStatus, Math.random())
        if (authStatus === '') {
            getUser(location);
        }
    }, [authStatus, getUser, location]);

    // console.log('AuthLoading', authStatus, Math.random())

    switch (authStatus) {
        case LOGGED_IN:
            let path = '/';
            if (location?.state?.from?.pathname) {
                path = location.state.from.pathname;
            }
            // console.log(path)
            return <Navigate to={path} replace={true} />;
        case LOG_IN_FORM:
            return <Navigate to="/identity/login" replace={true} />;
        case SIGN_UP_FORM:
            return <Navigate to="/identity/signup" replace={true} />;
        case INITIAL_RECOVERY:
            return <Navigate to="/identity/initialRecovery" replace={true} />;
    }

    return (
        <div className="w-full rounded md:flex ">
            <div className="rounded-lg bg-slate-200 px-24 py-36">
                <div className="font-inter_extrabold mb-8 text-center text-4xl text-slate-600">Loading</div>
            </div>
        </div>
    );
};

export default AuthLoading;
