import React, {useContext} from 'react';
import {Input} from 'react-daisyui';
import {FaRegEye, FaRegEyeSlash} from 'react-icons/fa';
import {MdKey} from 'react-icons/md';
import PasswordBrokerContext from '../../../../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext';

const Password = ({
    entryId,
    fieldLogin,
    fieldValue,
    changeLogin,
    changeValue,
    passwordEyeOpenHolder,
    passwordEyeCloseHolder,
    passwordHolder,
    togglePassword,
}) => {
    const {passwordGenerator} = useContext(PasswordBrokerContext);

    const generateNewPasswordHandler = () => {
        changeValue(passwordGenerator.generate());
    };

    return (
        <div className="items-center py-1.5">
            <div className="flex flex-row pb-1">
                <label htmlFor={'add-field-for-' + entryId + '-login'} className="inline-block basis-1/3 text-lg">
                    Login:
                </label>
                <Input
                    id={'add-field-for-' + entryId + '-login'}
                    className={'basis-2/3 bg-slate-800 text-slate-200 placeholder-slate-300'}
                    onChange={e => changeLogin(e.target.value)}
                    placeholder="type new login"
                    type="text"
                    size="sm"
                    value={fieldLogin}
                />
            </div>
            <div className="relative flex flex-row">
                <div className="flex basis-1/3 flex-row  justify-between ">
                    <label htmlFor={'add-field-for-' + entryId + '-value'} className="text-lg">
                        Password:
                    </label>
                    <div
                        className="mr-2 cursor-pointer text-3xl text-yellow-200"
                        title="generate a new key"
                        onClick={generateNewPasswordHandler}>
                        <MdKey />
                    </div>
                </div>
                <Input
                    ref={passwordHolder}
                    id={'add-field-for-' + entryId + '-value'}
                    className={'basis-2/3 bg-slate-800 text-slate-200 placeholder-slate-300'}
                    onChange={e => changeValue(e.target.value)}
                    placeholder="type new password"
                    type={'password'}
                    value={fieldValue}
                    size="sm"
                />
                <div className="absolute right-2 cursor-pointer text-3xl text-slate-200" onClick={togglePassword}>
                    <div ref={passwordEyeOpenHolder} title="Show the pasword">
                        <FaRegEye />
                    </div>
                    <div ref={passwordEyeCloseHolder} className="hidden" title="Hide the password">
                        <FaRegEyeSlash />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Password;
