import React, {useContext, useState} from 'react';
import PasswordBrokerContext from '../../src_shared/passwordBroker/contexts/PasswordBrokerContext';
import {Button, Input} from 'react-daisyui';
import AppContext from '../AppContext';

const MasterPasswordModal = () => {
    const {memorizeMasterPassword} = useContext(PasswordBrokerContext);

    const {masterPasswordModalVisibilityCheckboxRef, masterPasswordModalVisibilityErrorRef, closeMasterPasswordModal} =
        useContext(AppContext);

    const [masterPasswordField, setMasterPasswordField] = useState('');

    const handleMasterPasswordField = e => {
        setMasterPasswordField(e.target.value);
    };

    const handleSaveMasterPassword = () => {
        memorizeMasterPassword(masterPasswordField);
        setMasterPasswordField('');
        closeMasterPasswordModal();
    };

    return (
        <div className="m-0 p-0">
            <input
                type="checkbox"
                id="masterPasswordModal"
                className="modal-toggle"
                ref={masterPasswordModalVisibilityCheckboxRef}
                onChange={e => {
                    if (e.target.checked) {
                        const masterPasswordInput = document.getElementById('masterPasswordInput');
                        const interval = setInterval(() => {
                            masterPasswordInput.focus();
                            if (document.activeElement === masterPasswordInput) {
                                clearInterval(interval);
                            }
                        }, 50);
                    }
                }}
            />
            <label htmlFor="masterPasswordModal" className="modal cursor-pointer">
                <label className="modal-box relative w-1/3 max-w-none bg-slate-700" htmlFor="">
                    <h3 className="text-lg font-bold">Enter your Master Password</h3>
                    <div className="py-4">
                        <Input
                            id="masterPasswordInput"
                            type="password"
                            value={masterPasswordField}
                            onChange={handleMasterPasswordField}
                            placeholder="type your MasterPassword"
                            className={
                                'input-bordered input-sm w-full basis-2/3 bg-slate-800' +
                                ' text-slate-200 placeholder-slate-300'
                            }
                            onKeyUp={event => {
                                if (event.code === 'Enter') {
                                    handleSaveMasterPassword();
                                }
                            }}
                        />
                    </div>
                    <div className="modal-action flex flex-row justify-around">
                        <Button className={'btn-success btn-sm basis-1/3'} onClick={handleSaveMasterPassword}>
                            remember
                        </Button>

                        <label
                            htmlFor="masterPasswordModal"
                            className="btn btn-error btn-outline btn-sm right-0 basis-1/3">
                            close
                        </label>
                    </div>
                    <div
                        ref={masterPasswordModalVisibilityErrorRef}
                        className="w-full bg-red-700 text-center text-slate-100"
                    />
                </label>
            </label>
        </div>
    );
};

export default MasterPasswordModal;
