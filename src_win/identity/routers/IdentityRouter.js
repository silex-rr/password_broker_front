import {Route, Routes} from 'react-router-native';
import AuthLoading from '../components/AuthLoading';
import AuthLogin from '../components/AuthLogin';
import AuthSignup from '../components/AuthSignup';
import AuthLogout from '../components/AuthLogout';
import React from 'react';
import AuthContainer from '../components/AuthContainer';

const IdentityRouter = () => {
    return (
        <AuthContainer>
            <Routes>
                <Route path="loading" element={<AuthLoading option="loading" />} />
                <Route path="login" element={<AuthLogin option="login" />} />
                <Route path="signup" element={<AuthSignup option="signup" />} />
                <Route path="logout" element={<AuthLogout option="logout" />} />
            </Routes>
        </AuthContainer>
    );
};

export default IdentityRouter;
