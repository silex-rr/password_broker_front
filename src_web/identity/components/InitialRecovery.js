import {GoKey} from 'react-icons/go';
import {FaRegEye, FaRegEyeSlash} from 'react-icons/fa';
import React, {useContext, useState} from 'react';
import {LuDatabaseBackup} from 'react-icons/lu';
import IdentityContext from '../../../src_shared/identity/contexts/IdentityContext';
import {useNavigate} from 'react-router-dom';
import RecoveryContext from '../../../src_shared/identity/contexts/RecoveryContext';
import {
    RECOVERY_STATE_AWAIT,
    RECOVERY_STATE_DONE,
    RECOVERY_STATE_ERROR,
    RECOVERY_STATE_IN_PROCESS,
} from '../../../src_shared/identity/constants/RecoveryState';

const InitialRecovery = () => {
    const {changeAuthStatusSignup} = useContext(IdentityContext);

    const {
        recoveryBackupFile,
        setRecoveryBackupFile,
        recoveryBackupPassword,
        setRecoveryBackupPassword,
        recoveryError,
        recoveryRequest,
        recoveryState,
    } = useContext(RecoveryContext);

    const [hideRecoveryPassword, setHideRecoveryPassword] = useState(true);
    const navigate = useNavigate();
    const signupClickHandler = () => {
        if (!(recoveryState === RECOVERY_STATE_AWAIT || recoveryState === RECOVERY_STATE_ERROR)) {
            return;
        }
        changeAuthStatusSignup();
        navigate('/identity/signup');
    };
    const recoveryButtonClickHandler = () => {
        if (!(recoveryState === RECOVERY_STATE_AWAIT || recoveryState === RECOVERY_STATE_ERROR)) {
            return;
        }
        recoveryRequest();
    };

    const handleFileChange = event => {
        setRecoveryBackupFile(event.target.files[0]);
    };

    if (recoveryState === RECOVERY_STATE_DONE) {
        return (
            <div className="w-full md:flex">
                <div className="md:w-fill rounded-lg bg-slate-200 px-12 pb-16 pt-20 md:rounded-lg">
                    <div className="font-inter_extrabold mb-8 text-center text-3xl text-slate-700">
                        Recovery successfully completed{' '}
                        <a href="/" className="underline">
                            return to main page
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full md:flex">
            <div className="md:w-fill rounded-lg bg-slate-200 px-12 pb-16 pt-20 md:rounded-lg">
                <div className="font-inter_extrabold mb-8 text-center text-4xl text-slate-700">
                    <span className="text-2xl text-slate-600">
                        <span className="cursor-pointer underline" onClick={signupClickHandler}>
                            Signup
                        </span>{' '}
                        /{' '}
                    </span>
                    Recovery
                </div>

                <div className={'mb-2 grid w-full grid-cols-7'}>
                    <div className="col-span-1 bg-slate-500 pt-1">
                        <LuDatabaseBackup className="mx-auto text-3xl text-white" />
                    </div>
                    <div className="col-span-6">
                        <input
                            className="w-full bg-slate-300 py-2 pl-3 text-slate-800 placeholder-slate-700"
                            name="password"
                            type="file"
                            placeholder="a backup file"
                            onChange={handleFileChange}
                        />
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
                            type={hideRecoveryPassword ? 'password' : 'text'}
                            placeholder="Backup Password"
                            value={recoveryBackupPassword ?? ''}
                            onChange={e => setRecoveryBackupPassword(e.target.value)}
                        />
                    </div>
                    <div className="col-span-1 bg-slate-300 pt-1 text-center">
                        <button
                            className="text-3xl text-slate-700 focus:outline-none"
                            onClick={() => {
                                setHideRecoveryPassword(state => !state);
                            }}>
                            {hideRecoveryPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                        </button>
                    </div>
                </div>

                <div className="mt-12 flex w-full flex-col justify-center">
                    <button
                        className={
                            'font-inter_bold rounded border border-slate-700 px-10 py-2 text-center text-slate-700' +
                            ' hover:bg-slate-700 hover:text-white focus:outline-none'
                        }
                        onClick={recoveryButtonClickHandler}>
                        {recoveryState === RECOVERY_STATE_IN_PROCESS ? 'In Process' : 'Recovery'}
                    </button>
                </div>

                <div
                    className={`mt-2 bg-red-300 p-1 text-center text-slate-700 ${
                        recoveryError === '' ? 'hidden' : ''
                    }`}>
                    {recoveryError}
                </div>
            </div>
        </div>
    );
};

export default InitialRecovery;
