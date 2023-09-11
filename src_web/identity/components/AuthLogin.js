import React, { useContext, useState } from "react";
import { IdentityContext } from "../../../src_shared/identity/contexts/IdentityContext";
import { MdEmail } from "react-icons/md";
import { GoKey } from "react-icons/go";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import {Navigate, useNavigate} from "react-router-dom";
import {LOGGED_IN} from "../../../src_shared/identity/constants/AuthStatus";
import {AUTH_LOGIN_AWAIT, AUTH_LOGIN_IN_PROCESS} from "../../../src_shared/identity/constants/AuthLoginStatus";
import {ClockLoader} from "react-spinners";

const AuthLogin = () => {
    let navigate = useNavigate();
    const identityContext = useContext(IdentityContext);
    const {
        userEmail,
        userPassword,
        handleUserEmail,
        handleUserPassword,
        login,
        errorMessage,
        authStatus,
        authLoginStatus
    } = identityContext;
    const [hidePassword, setHidePassword] = useState(true);
    const [loaderSpinnerColor, setLoaderSpinnerColor] = useState('#e2e8f0')

    const showHiddenPassword = hidePassword ? "" : "hidden";
    const showRevealedPassword = hidePassword ? "hidden" : "";
    function togglePassword() {
        setHidePassword(!hidePassword);
    }
    // console.log('login', authStatus)
    if (authStatus === LOGGED_IN) {
        return (<Navigate to="/" replace />)
    }

    let loginButton = ''


    if (authLoginStatus === AUTH_LOGIN_AWAIT) {
        loginButton = "Login"
    }

    const spinnerMouseEnterHandler = () => {
        setLoaderSpinnerColor('#e2e8f0')
    }
    const spinnerMouseLeaveHandler = () => {
        setLoaderSpinnerColor('#64748b')
    }

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
                    <span className="pl-2">
                        Loading ...
                    </span>
                </span>

            )
    }

    return (
        <div className="md:flex w-full rounded ">
            <form className="bg-slate-200 py-24 px-12 rounded-lg"
                onSubmit={(e) => {e.preventDefault(); login()}}
            >
                <div className="font-inter_extrabold text-4xl text-slate-700 text-center mb-8">
                    Login
                </div>
                {/* EMAIL */}
                <div className="grid grid-cols-7 w-full mb-4">
                    <div className="col-span-1 bg-slate-500 pt-1">
                        <MdEmail className="text-slate-100 text-3xl mx-auto" />
                    </div>
                    <div className="col-span-6">
                        <input
                            className="w-full bg-slate-300 text-slate-800 placeholder-slate-700 pl-3 py-2"
                            name="email"
                            type="text"
                            placeholder="Email"
                            value={userEmail}
                            onChange={(changeEvent) => handleUserEmail(changeEvent.target.value)}
                        />
                    </div>
                </div>
                {/* HIDDEN PASSWORD */}
                <div className={showHiddenPassword + " grid grid-cols-7 w-full"}>
                    <div className="col-span-1 bg-slate-500 pt-1">
                        <GoKey className="text-slate-100 text-3xl mx-auto" />
                    </div>
                    <div className="col-span-5">
                        <input
                            className="w-full bg-slate-300 text-slate-800 placeholder-slate-700 pl-3 py-2"
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={userPassword}
                            onChange={(changeEvent) => handleUserPassword(changeEvent.target.value)}
                        />
                    </div>
                    <div className="col-span-1 bg-slate-300 text-center pt-1">
                        <span
                            className="text-slate-500 text-3xl focus:outline-none cursor-pointer"
                            onClick={() => togglePassword()}
                        >
                            <FaRegEye />
                        </span>
                    </div>
                </div>
                {/* REVEALED PASSWORD */}
                <div className={showRevealedPassword + " grid grid-cols-7 w-full"}>
                    <div className="col-span-1 bg-slate-500 pt-1">
                        <GoKey className="text-white text-3xl mx-auto" />
                    </div>
                    <div className="col-span-5">
                        <input
                            className="w-full bg-slate-300 placeholder-slate-800 text-slate-800 pl-3 py-2"
                            name="password"
                            type="text"
                            placeholder="Password"
                            value={userPassword}
                            onChange={(e) => handleUserPassword(e.target.value)}
                        />
                    </div>
                    <div className="col-span-1 bg-slate-300 text-center pt-1 cursor-pointer">
                        <span
                            className="text-slate-500 text-3xl focus:outline-none"
                            onClick={() => togglePassword()}
                        >
                            <FaRegEyeSlash />
                        </span>
                    </div>
                </div>
                {/* SUBMIT BUTTON */}
                <div className="flex justify-center w-full mt-12">
                    <button
                        className="font-inter_bold hover:bg-slate-700 text-slate-700 hover:text-white
                            text-center rounded py-2 px-10 border border-slate-700 focus:outline-none"
                        onClick={() => login()}
                        onMouseEnter={spinnerMouseEnterHandler}
                        onMouseLeave={spinnerMouseLeaveHandler}
                    >
                        {loginButton}
                    </button>
                </div>
                <div className="w-full text-red-600 text-center mt-8">
                    {errorMessage}
                </div>
            </form>
        </div>
    );
};

export default AuthLogin;
