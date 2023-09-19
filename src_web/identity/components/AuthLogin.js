import React, {useContext, useState} from 'react';
import IdentityContext from '../../../src_shared/identity/contexts/IdentityContext';
import {MdEmail} from 'react-icons/md';
import {GoKey} from 'react-icons/go';
import {FaRegEye} from 'react-icons/fa';
import {FaRegEyeSlash} from 'react-icons/fa';
import {Navigate} from 'react-router-dom';
import {LOGGED_IN} from '../../../src_shared/identity/constants/AuthStatus';
import {AUTH_LOGIN_AWAIT, AUTH_LOGIN_IN_PROCESS} from '../../../src_shared/identity/constants/AuthLoginStatus';
import {ClockLoader} from 'react-spinners';

const AuthLogin = () => {
    // let navigate = useNavigate();
    const identityContext = useContext(IdentityContext);
    const {
        userEmail,
        userPassword,
        handleUserEmail,
        handleUserPassword,
        login,
        errorMessage,
        authStatus,
        authLoginStatus,
    } = identityContext;
    const [hidePassword, setHidePassword] = useState(true);
    const [loaderSpinnerColor, setLoaderSpinnerColor] = useState('#e2e8f0');

    const showHiddenPassword = hidePassword ? '' : 'hidden';
    const showRevealedPassword = hidePassword ? 'hidden' : '';
    function togglePassword() {
        setHidePassword(!hidePassword);
    }
    // console.log('login', authStatus)
    if (authStatus === LOGGED_IN) {
        return <Navigate to="/" replace />;
    }

    let loginButton = '';

    if (authLoginStatus === AUTH_LOGIN_AWAIT) {
        loginButton = 'Login';
    }

    const spinnerMouseEnterHandler = () => {
        setLoaderSpinnerColor('#e2e8f0');
    };
    const spinnerMouseLeaveHandler = () => {
        setLoaderSpinnerColor('#64748b');
    };

    if (authLoginStatus === AUTH_LOGIN_IN_PROCESS) {
        loginButton = (
            <span className="flex flex-row place-content-center place-items-center">
                <ClockLoader
                    color={loaderSpinnerColor}
                    size={18}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                    speedMultiplier={1}
                />
                <span className="pl-2">Loading ...</span>
            </span>
        );
    }

    return (
        <div className="w-full rounded md:flex ">
            <form
                className="rounded-lg bg-slate-200 px-12 py-24"
                onSubmit={e => {
                    e.preventDefault();
                    login();
                }}>
                <div className="font-inter_extrabold mb-8 text-center text-4xl text-slate-700">Login</div>
                {/* EMAIL */}
                <div className="mb-4 grid w-full grid-cols-7">
                    <div className="col-span-1 bg-slate-500 pt-1">
                        <MdEmail className="mx-auto text-3xl text-slate-100" />
                    </div>
                    <div className="col-span-6">
                        <input
                            className="w-full bg-slate-300 py-2 pl-3 text-slate-800 placeholder-slate-700"
                            name="email"
                            type="text"
                            placeholder="Email"
                            value={userEmail}
                            onChange={changeEvent => handleUserEmail(changeEvent.target.value)}
                        />
                    </div>
                </div>
                {/* HIDDEN PASSWORD */}
                <div className={showHiddenPassword + ' grid w-full grid-cols-7'}>
                    <div className="col-span-1 bg-slate-500 pt-1">
                        <GoKey className="mx-auto text-3xl text-slate-100" />
                    </div>
                    <div className="col-span-5">
                        <input
                            className="w-full bg-slate-300 py-2 pl-3 text-slate-800 placeholder-slate-700"
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={userPassword}
                            onChange={changeEvent => handleUserPassword(changeEvent.target.value)}
                        />
                    </div>
                    <div className="col-span-1 bg-slate-300 pt-1 text-center">
                        <span
                            className="cursor-pointer text-3xl text-slate-500 focus:outline-none"
                            onClick={() => togglePassword()}>
                            <FaRegEye />
                        </span>
                    </div>
                </div>
                {/* REVEALED PASSWORD */}
                <div className={showRevealedPassword + ' grid w-full grid-cols-7'}>
                    <div className="col-span-1 bg-slate-500 pt-1">
                        <GoKey className="mx-auto text-3xl text-white" />
                    </div>
                    <div className="col-span-5">
                        <input
                            className="w-full bg-slate-300 py-2 pl-3 text-slate-800 placeholder-slate-800"
                            name="password"
                            type="text"
                            placeholder="Password"
                            value={userPassword}
                            onChange={e => handleUserPassword(e.target.value)}
                        />
                    </div>
                    <div className="col-span-1 cursor-pointer bg-slate-300 pt-1 text-center">
                        <span className="text-3xl text-slate-500 focus:outline-none" onClick={() => togglePassword()}>
                            <FaRegEyeSlash />
                        </span>
                    </div>
                </div>
                {/* SUBMIT BUTTON */}
                <div className="mt-12 flex w-full justify-center">
                    <button
                        className={
                            'font-inter_bold rounded border border-slate-700 px-10 py-2 text-center text-slate-700' +
                            ' hover:bg-slate-700 hover:text-white focus:outline-none'
                        }
                        onClick={() => login()}
                        onMouseEnter={spinnerMouseEnterHandler}
                        onMouseLeave={spinnerMouseLeaveHandler}>
                        {loginButton}
                    </button>
                </div>
                <div className="mt-8 w-full text-center text-red-600">{errorMessage}</div>
            </form>
        </div>
    );
};

export default AuthLogin;
