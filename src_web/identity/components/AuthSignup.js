import React, {useContext, useState} from 'react';
import IdentityContext from '../../../src_shared/identity/contexts/IdentityContext';
import {MdEmail} from 'react-icons/md';
import {GoKey} from 'react-icons/go';
import {IoMdPerson} from 'react-icons/io';
import {FaRegEye} from 'react-icons/fa';
import {FaRegEyeSlash} from 'react-icons/fa';

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
    const showHiddenPassword = hidePassword ? '' : 'hidden';
    const showRevealedPassword = hidePassword ? 'hidden' : '';
    function togglePassword() {
        setHidePassword(!hidePassword);
    }
    return (
        <div className="w-full md:flex">
            <div className="md:w-fill rounded-lg bg-slate-200 px-12 pb-16 pt-20 md:rounded-lg">
                <div className="font-inter_extrabold mb-8 text-center text-4xl text-slate-700">Signup</div>
                {/* USER NAME */}
                <div className="mb-4 grid w-full grid-cols-7">
                    <div className="col-span-1 bg-slate-700 pt-1">
                        <IoMdPerson className="mx-auto text-3xl text-white" />
                    </div>
                    <div className="col-span-6">
                        <input
                            className="w-full bg-slate-300 py-2 pl-3 placeholder-slate-800"
                            name="userName"
                            type="text"
                            placeholder="User Name"
                            value={userNameInput}
                            onChange={changeEvent => handleUserNameInput(changeEvent.target.value)}
                        />
                    </div>
                </div>
                {/* EMAIL */}
                <div className="mb-4 grid w-full grid-cols-7">
                    <div className="col-span-1 bg-slate-700 pt-1">
                        <MdEmail className="mx-auto text-3xl text-white" />
                    </div>
                    <div className="col-span-6">
                        <input
                            className="w-full bg-slate-300 py-2 pl-3 placeholder-slate-800"
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
                    <div className="col-span-1 bg-slate-700 pt-1">
                        <GoKey className="mx-auto text-3xl text-white" />
                    </div>
                    <div className="col-span-5">
                        <input
                            className="w-full bg-slate-300 py-2 pl-3 placeholder-slate-800"
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={userPassword}
                            onChange={changeEvent => handleUserPassword(changeEvent.target.value)}
                        />
                    </div>
                    <div className="col-span-1 bg-slate-300 pt-1 text-center">
                        <button className="text-3xl text-slate-700 focus:outline-none" onClick={() => togglePassword()}>
                            <FaRegEye />
                        </button>
                    </div>
                </div>
                {/* REVEALED PASSWORD */}
                <div className={showRevealedPassword + ' grid w-full grid-cols-7'}>
                    <div className="col-span-1 bg-slate-700 pt-1">
                        <GoKey className="mx-auto text-3xl text-white" />
                    </div>
                    <div className="col-span-5">
                        <input
                            className="w-full bg-slate-300 py-2 pl-3 placeholder-slate-800"
                            name="password"
                            type="text"
                            placeholder="Password"
                            value={userPassword}
                            onChange={changeEvent => handleUserPassword(changeEvent.target.value)}
                        />
                    </div>
                    <div className="col-span-1 bg-slate-300 pt-1 text-center">
                        <button className="text-3xl text-slate-700 focus:outline-none" onClick={() => togglePassword()}>
                            <FaRegEyeSlash />
                        </button>
                    </div>
                </div>
                {/* GrSecure */}
                {/* SUBMIT BUTTON */}
                <div className="mt-12 flex w-full justify-center">
                    <button
                        className={
                            'font-inter_bold rounded border border-slate-700 px-10 py-2 text-center' +
                            'text-slate-700 hover:bg-slate-700 hover:text-white focus:outline-none'
                        }
                        onClick={() => signup()}>
                        Signup
                    </button>
                </div>
                <div className="mt-8 w-full text-center text-red-600">{errorMessage}</div>
            </div>
        </div>
    );
};

export default AuthSignup;
