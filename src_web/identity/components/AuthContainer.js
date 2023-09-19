import React from 'react';
import AuthSignup from './AuthSignup';
import AuthLogin from './AuthLogin';
import AuthLoading from './AuthLoading';
// import {IdentityContext} from '../../../src_shared/identity/contexts/IdentityContext';
import {Route, Routes} from 'react-router-dom';
import AuthLogout from './AuthLogout';

const AuthContainer = () => {
    // const identityContext = useContext(IdentityContext);

    // const {authStatus} = identityContext;
    // console.log('AuthContainer', Math.random())

    return (
        <div className="flex w-full justify-center pb-32 pt-16">
            <div className="w-auto">
                <div className={' justify-end py-4'}>
                    <Routes>
                        <Route path="loading" element={<AuthLoading option="loading" />} />
                        <Route path="login" element={<AuthLogin option="login" />} />
                        <Route path="signup" element={<AuthSignup option="signup" />} />
                        <Route path="logout" element={<AuthLogout option="logout" />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default AuthContainer;
