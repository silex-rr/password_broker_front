import {GoKey} from 'react-icons/go';
import {FaRegEye, FaRegEyeSlash} from 'react-icons/fa';
import React, {useContext, useState} from 'react';
import {LuDatabaseBackup} from 'react-icons/lu';
import IdentityContext from '../../../src_shared/identity/contexts/IdentityContext';
import {useNavigate} from 'react-router-dom';

const InitialRecovery = () => {
    const {
        recoveryBackupFile,
        setRecoveryBackupFile,
        recoveryBackupPassword,
        setRecoveryBackupPassword,
        changeAuthStatusSignup,
    } = useContext(IdentityContext);
    const [hideRecoveryPassword, setHideRecoveryPassword] = useState(true);
    const navigate = useNavigate();
    const signupClickHandler = () => {
        changeAuthStatusSignup();
        navigate('/identity/signup');
    };
    console.log(2);

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
                            value={recoveryBackupFile}
                            onChange={() => e => setRecoveryBackupFile(e.target.files[0])}
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
                            placeholder="Password for Backup"
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
                        onClick={() => {}}>
                        Recovery
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InitialRecovery;
