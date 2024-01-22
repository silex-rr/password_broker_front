import React, {useContext, useState} from 'react';
import IdentityContext from '../../../src_shared/identity/contexts/IdentityContext';
import {MdEmail, MdOutlineKey} from 'react-icons/md';
import {GoKey} from 'react-icons/go';
import {IoMdPerson} from 'react-icons/io';
import {FaRegEye} from 'react-icons/fa';
import {FaRegEyeSlash} from 'react-icons/fa';
import {
    REGISTRATION_AWAIT,
    REGISTRATION_IN_PROCESS,
    REGISTRATION_VALIDATING,
    REGISTRATION_VALIDATION_RETURNED_ERRORS,
    REGISTRATION_VALIDATION_RETURNED_WARNINGS,
} from '../../../src_shared/identity/constants/RegistrationStates';
import AuthSignupErrors from './AuthSignupErrors';
import {ClockLoader} from 'react-spinners';

const AuthSignup = () => {
    const identityContext = useContext(IdentityContext);
    const {
        userNameInput,
        userEmail,
        userPassword,
        userPasswordConfirmation,
        userRegistrationMasterPassword,
        userRegistrationMasterPasswordConfirmation,
        handleUserNameInput,
        handleUserEmail,
        handleUserPassword,
        handleUserPasswordConfirmation,
        handleUserRegistrationMasterPassword,
        handleUserRegistrationMasterPasswordConfirmation,
        signup,
        signupValidator,
        registrationState,
        setRegistrationState,
        errorMessage,
    } = identityContext;
    const [hidePassword, setHidePassword] = useState(true);
    const [hideMasterPassword, setHideMasterPassword] = useState(true);
    const [signUpErrors, setSignUpErrors] = useState({});
    const [signUpWarnings, setSignUpWarnings] = useState({});
    const togglePassword = () => {
        setHidePassword(!hidePassword);
    };
    const toggleMasterPassword = () => {
        setHideMasterPassword(!hideMasterPassword);
    };

    const signupHandler = (ignoreWarnings = false) => {
        switch (registrationState) {
            case REGISTRATION_AWAIT:
            case REGISTRATION_VALIDATION_RETURNED_WARNINGS:
            case REGISTRATION_VALIDATION_RETURNED_ERRORS:
                const signupValidatorResult = signupValidator();
                setSignUpErrors(signupValidatorResult.signUpErrors);
                setSignUpWarnings(signupValidatorResult.signUpWarnings);
                if (Object.keys(signupValidatorResult.signUpErrors).length) {
                    setRegistrationState(REGISTRATION_VALIDATION_RETURNED_ERRORS);
                    break;
                }
                if (Object.keys(signupValidatorResult.signUpWarnings).length && !ignoreWarnings) {
                    setRegistrationState(REGISTRATION_VALIDATION_RETURNED_WARNINGS);
                    break;
                }
                signup();
                break;
            default:
            case REGISTRATION_VALIDATING:
            case REGISTRATION_IN_PROCESS:
                break;
        }
    };

    let signupButtonContent = '';
    switch (registrationState) {
        case REGISTRATION_VALIDATION_RETURNED_WARNINGS:
        case REGISTRATION_VALIDATION_RETURNED_ERRORS:
            signupButtonContent = 'Check and signup';
            break;
        default:
        case REGISTRATION_AWAIT:
            signupButtonContent = 'Signup';
            break;
        case REGISTRATION_VALIDATING:
        case REGISTRATION_IN_PROCESS:
            signupButtonContent = (
                <span className="flex items-center justify-center">
                    <span className="px-2">
                        <ClockLoader
                            color="#a4acb5"
                            size={18}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                            speedMultiplier={1}
                        />
                    </span>
                    loading...
                </span>
            );
            break;
    }

    return (
        <div className="w-full md:flex">
            <div className="md:w-fill rounded-lg bg-slate-200 px-12 pb-16 pt-20 md:rounded-lg">
                <div className="font-inter_extrabold mb-8 text-center text-4xl text-slate-700">Signup</div>
                {/* USER NAME */}
                <div className="mb-4 grid w-full grid-cols-7">
                    <div className="col-span-1 bg-slate-500 pt-1">
                        <IoMdPerson className="mx-auto text-3xl text-white" />
                    </div>
                    <div className="col-span-6">
                        <input
                            className="w-full bg-slate-300 py-2 pl-3 text-slate-800 placeholder-slate-700"
                            name="userName"
                            type="text"
                            placeholder="User Name"
                            value={userNameInput}
                            onChange={changeEvent => handleUserNameInput(changeEvent.target.value)}
                        />
                    </div>
                    <div className={'col-span-7'}>
                        <AuthSignupErrors filedKey="userName" errors={signUpErrors} warnings={signUpWarnings} />
                    </div>
                </div>
                {/* EMAIL */}
                <div className="mb-4 grid w-full grid-cols-7">
                    <div className="col-span-1 bg-slate-500 pt-1">
                        <MdEmail className="mx-auto text-3xl text-white" />
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
                    <div className={'col-span-7'}>
                        <AuthSignupErrors filedKey="userEmail" errors={signUpErrors} warnings={signUpWarnings} />
                    </div>
                </div>
                <div className={'mb-2 grid w-full grid-cols-7'}>
                    <div className="col-span-1 bg-slate-500 pt-1">
                        <GoKey className="mx-auto text-3xl text-white" />
                    </div>
                    <div className="col-span-5">
                        <input
                            className="w-full bg-slate-300 py-2 pl-3 text-slate-800 placeholder-slate-700"
                            name="password"
                            type={hidePassword ? 'password' : 'text'}
                            placeholder="Password"
                            value={userPassword}
                            onChange={changeEvent => handleUserPassword(changeEvent.target.value)}
                        />
                    </div>
                    <div className="col-span-1 bg-slate-300 pt-1 text-center">
                        <button className="text-3xl text-slate-700 focus:outline-none" onClick={() => togglePassword()}>
                            {hidePassword ? <FaRegEye /> : <FaRegEyeSlash />}
                        </button>
                    </div>
                    <div className={'col-span-7'}>
                        <AuthSignupErrors filedKey="userPassword" errors={signUpErrors} warnings={signUpWarnings} />
                    </div>
                </div>
                <div className={'mb-4 grid w-full grid-cols-7'}>
                    <div className="col-span-1 bg-slate-400 pt-1">
                        <GoKey className="mx-auto text-3xl text-white" />
                    </div>
                    <div className="col-span-5">
                        <input
                            className={
                                'w-full py-2 pl-3 text-slate-800 placeholder-slate-700 ' +
                                (userPassword !== userPasswordConfirmation ? 'bg-red-300' : 'bg-slate-300')
                            }
                            name="password"
                            type={hidePassword ? 'password' : 'text'}
                            placeholder="Password Confirmation"
                            value={userPasswordConfirmation}
                            onChange={changeEvent => handleUserPasswordConfirmation(changeEvent.target.value)}
                        />
                    </div>
                    <div className="col-span-1 bg-slate-300 pt-1 text-center">
                        <button className="text-3xl text-slate-700 focus:outline-none" onClick={togglePassword}>
                            {hidePassword ? <FaRegEye /> : <FaRegEyeSlash />}
                        </button>
                    </div>
                    <div className={'col-span-7'}>
                        <AuthSignupErrors
                            filedKey="userPasswordConfirmation"
                            errors={signUpErrors}
                            warnings={signUpWarnings}
                        />
                    </div>
                </div>
                <div className={'mb-2 grid w-full grid-cols-7'}>
                    <div className="col-span-1 bg-slate-500 pt-1">
                        <MdOutlineKey className="mx-auto text-3xl text-white" />
                    </div>
                    <div className="col-span-5">
                        <input
                            className="w-full bg-slate-300 py-2 pl-3 text-slate-800 placeholder-slate-700"
                            name="master_password"
                            type={hideMasterPassword ? 'password' : 'text'}
                            placeholder="Master Password"
                            value={userRegistrationMasterPassword}
                            onChange={changeEvent => handleUserRegistrationMasterPassword(changeEvent.target.value)}
                        />
                    </div>
                    <div className="col-span-1 bg-slate-300 pt-1 text-center">
                        <button className="text-3xl text-slate-700 focus:outline-none" onClick={toggleMasterPassword}>
                            {hideMasterPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                        </button>
                    </div>
                    <div className={'col-span-7'}>
                        <AuthSignupErrors
                            filedKey="userRegistrationMasterPassword"
                            errors={signUpErrors}
                            warnings={signUpWarnings}
                        />
                    </div>
                </div>
                <div className={'grid w-full grid-cols-7'}>
                    <div className="col-span-1 bg-slate-400 pt-1">
                        <MdOutlineKey className="mx-auto text-3xl text-white" />
                    </div>
                    <div className="col-span-5">
                        <input
                            className={
                                'w-full py-2 pl-3 text-slate-800 placeholder-slate-700 ' +
                                (userRegistrationMasterPassword !== userRegistrationMasterPasswordConfirmation
                                    ? 'bg-red-300'
                                    : 'bg-slate-300')
                            }
                            name="master_password_confirmation"
                            type={hideMasterPassword ? 'password' : 'text'}
                            placeholder="Master Password Confiramtion"
                            value={userRegistrationMasterPasswordConfirmation}
                            onChange={changeEvent =>
                                handleUserRegistrationMasterPasswordConfirmation(changeEvent.target.value)
                            }
                        />
                    </div>
                    <div className="col-span-1 bg-slate-300 pt-1 text-center">
                        <button className="text-3xl text-slate-700 focus:outline-none" onClick={toggleMasterPassword}>
                            {hideMasterPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                        </button>
                    </div>
                    <div className={'col-span-7'}>
                        <AuthSignupErrors
                            filedKey="userRegistrationMasterPasswordConfirmation"
                            errors={signUpErrors}
                            warnings={signUpWarnings}
                        />
                    </div>
                </div>
                {/* SUBMIT BUTTON */}
                <div className="mt-12 flex w-full flex-col justify-center">
                    <button
                        className={
                            'font-inter_bold rounded border border-slate-700 px-10 py-2 text-center text-slate-700' +
                            ' hover:bg-slate-700 hover:text-white focus:outline-none'
                        }
                        onClick={() => signupHandler(false)}>
                        {signupButtonContent}
                    </button>
                    {registrationState === REGISTRATION_VALIDATION_RETURNED_WARNINGS ? (
                        <button
                            onClick={() => {
                                signupHandler(true);
                            }}
                            className={
                                'font-inter_bold rounded border border-slate-700 bg-amber-100 px-10 py-2 text-center' +
                                ' mt-2 text-slate-700 hover:bg-slate-700 hover:text-white focus:outline-none'
                            }>
                            Continue despite warnings
                        </button>
                    ) : (
                        ''
                    )}
                </div>
                <div className="mt-8 w-full text-center text-red-600">{errorMessage}</div>
            </div>
        </div>
    );
};

export default AuthSignup;
