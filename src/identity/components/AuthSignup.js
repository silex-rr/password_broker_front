import React, { useContext, useState } from "react";
import { IdentityContext } from "../contexts/IdentityContext";
import { MdEmail } from "react-icons/md";
import { GoKey } from "react-icons/go";
import { IoMdPerson } from "react-icons/io";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import AuthMenu from "./AuthMenu";

const AuthSignup = () => {
    const identityContext = useContext(IdentityContext);
    const {
        userNameInput,
        userEmail,
        userPassword,
        handleUserNameInput,
        handleUserEmail,
        handleUserPassword,
        signup,
        errorMessage,
    } = identityContext;
    const [hidePassword, setHidePassword] = useState(true);
    const showHiddenPassword = hidePassword ? "" : "hidden";
    const showRevealedPassword = hidePassword ? "hidden" : "";
    function togglePassword() {
        setHidePassword(!hidePassword);
    }
    return (
        <div className="md:flex w-full">
            <div className="md:w-fill bg-slate-200 pt-20 pb-16 px-12 rounded-lg md:rounded-lg">
                <div className="font-inter_extrabold text-4xl text-slate-700 text-center mb-8">
                    Signup
                </div>
                {/* USER NAME */}
                <div className="grid grid-cols-7 w-full mb-4">
                    <div className="col-span-1 bg-slate-700 pt-1">
                        <IoMdPerson className="text-white text-3xl mx-auto" />
                    </div>
                    <div className="col-span-6">
                        <input
                            className="w-full bg-slate-300 placeholder-slate-800 pl-3 py-2"
                            name="userName"
                            type="text"
                            placeholder="User Name"
                            value={userNameInput}
                            onChange={handleUserNameInput}
                        />
                    </div>
                </div>
                {/* EMAIL */}
                <div className="grid grid-cols-7 w-full mb-4">
                    <div className="col-span-1 bg-slate-700 pt-1">
                        <MdEmail className="text-white text-3xl mx-auto" />
                    </div>
                    <div className="col-span-6">
                        <input
                            className="w-full bg-slate-300 placeholder-slate-800 pl-3 py-2"
                            name="email"
                            type="text"
                            placeholder="Email"
                            value={userEmail}
                            onChange={handleUserEmail}
                        />
                    </div>
                </div>
                {/* HIDDEN PASSWORD */}
                <div className={showHiddenPassword + " grid grid-cols-7 w-full"}>
                    <div className="col-span-1 bg-slate-700 pt-1">
                        <GoKey className="text-white text-3xl mx-auto" />
                    </div>
                    <div className="col-span-5">
                        <input
                            className="w-full bg-slate-300 placeholder-slate-800 pl-3 py-2"
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={userPassword}
                            onChange={handleUserPassword}
                        />
                    </div>
                    <div className="col-span-1 bg-slate-300 text-center pt-1">
                        <button
                            className="text-slate-700 text-3xl focus:outline-none"
                            onClick={() => togglePassword()}
                        >
                            <FaRegEye />
                        </button>
                    </div>
                </div>
                {/* REVEALED PASSWORD */}
                <div className={showRevealedPassword + " grid grid-cols-7 w-full"}>
                    <div className="col-span-1 bg-slate-700 pt-1">
                        <GoKey className="text-white text-3xl mx-auto" />
                    </div>
                    <div className="col-span-5">
                        <input
                            className="w-full bg-slate-300 placeholder-slate-800 pl-3 py-2"
                            name="password"
                            type="text"
                            placeholder="Password"
                            value={userPassword}
                            onChange={handleUserPassword}
                        />
                    </div>
                    <div className="col-span-1 bg-slate-300 text-center pt-1">
                        <button
                            className="text-slate-700 text-3xl focus:outline-none"
                            onClick={() => togglePassword()}
                        >
                            <FaRegEyeSlash />
                        </button>
                    </div>
                </div>
                {/* GrSecure */}
                {/* SUBMIT BUTTON */}
                <div className="flex justify-center w-full mt-12">
                    <button
                        className="font-inter_bold hover:bg-slate-700 text-slate-700 hover:text-white
                            text-center rounded py-2 px-10 border border-slate-700 focus:outline-none"
                        onClick={() => signup()}
                    >
                        Signup
                    </button>
                </div>
                <div className="w-full text-red-600 text-center mt-8">
                    {errorMessage}
                </div>
            </div>
        </div>
    );
};

export default AuthSignup;

