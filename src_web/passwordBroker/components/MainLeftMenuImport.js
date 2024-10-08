import React, {useContext, useState} from 'react';
import {Button, Input} from 'react-daisyui';
import axios from 'axios';
import {
    MASTER_PASSWORD_INVALID,
    MASTER_PASSWORD_VALIDATED,
} from '../../../src_shared/passwordBroker/constants/MasterPasswordStates';
import PasswordBrokerContext from '../../../src_shared/passwordBroker/contexts/PasswordBrokerContext';
import {ENTRY_GROUP_TREES_REQUIRED_LOADING} from '../../../src_shared/passwordBroker/constants/EntryGroupTreesStatus';
import Error from '../../common/errors/Error';
import {RiFolderDownloadFill} from 'react-icons/ri';

const MainLeftMenuImport = ({menuButtonSize}) => {
    const passwordBrokerContext = useContext(PasswordBrokerContext);
    const {
        masterPassword,
        setMasterPassword,
        setMasterPasswordCallback,
        setMasterPasswordState,
        showMasterPasswordModal,
        baseUrl,
        setEntryGroupTreesStatus,
    } = passwordBrokerContext;

    const [importFile, setImportFile] = useState(null);
    const [importValue, setImportValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState({message: '', errors: {}});

    const handleOpenModal = e => {
        if (e.target.checked) {
            setErrorMessage({message: '', errors: {}});
            setLoading(false);
            setImportFile(null);
            setImportValue('');
        }
    };
    const handleChangeFile = e => {
        setImportValue(e.target.value);
        setImportFile(e.target.files[0]);
    };

    const handleSendButton = () => {
        if (loading) {
            return;
        }
        const sendImportData = masterPasswordNew => {
            setLoading(true);
            const data = new FormData();
            data.append('master_password', masterPasswordNew);
            data.append('file', importFile);
            axios
                .post(baseUrl + '/import', data)
                .then(
                    () => {
                        setMasterPasswordState(MASTER_PASSWORD_VALIDATED);
                        setEntryGroupTreesStatus(ENTRY_GROUP_TREES_REQUIRED_LOADING);
                    },
                    error => {
                        if (error.response.data.errors.master_password) {
                            setMasterPassword('');
                            setMasterPasswordState(MASTER_PASSWORD_INVALID);
                            setMasterPasswordCallback(() => masterPasswordForCheck => {
                                sendImportData(masterPasswordForCheck);
                            });
                            showMasterPasswordModal('MasterPassword is invalid');
                            return;
                        }
                        setErrorMessage(error.response.data);
                    },
                )
                .then(() => {
                    setLoading(false);
                });
        };

        if (masterPassword === '') {
            setMasterPasswordCallback(() => masterPasswordForCheck => {
                sendImportData(masterPasswordForCheck);
            });
            showMasterPasswordModal();
        } else {
            sendImportData(masterPassword);
        }
    };

    return (
        <React.Fragment>
            <label htmlFor="importData" className="tooltip tooltip-right" data-tip="import Data">
                <RiFolderDownloadFill className={'inline-block ' + menuButtonSize + ' cursor-pointer'} />
            </label>

            <input type="checkbox" id="importData" className="modal-toggle" onChange={handleOpenModal} />

            <label htmlFor="importData" className="modal cursor-pointer text-slate-100">
                <label className="modal-box relative w-1/3 max-w-none bg-slate-700" htmlFor="">
                    <h3 className="text-lg font-bold">Import data from KeePass XML (2.x)</h3>
                    <div className="py-4">
                        <div className="flex w-full flex-row items-center py-1.5">
                            <div className="flex w-full flex-row items-center py-1.5">
                                <label htmlFor={'importData-file'} className="inline-block basis-1/3 text-lg">
                                    KeePass XML (2.x) File:
                                </label>
                                <Input
                                    id="importData-file"
                                    className={
                                        'file-input file-input-bordered file-input-sm w-full basis-2/3' +
                                        ' bg-slate-800 text-slate-200 placeholder-slate-300'
                                    }
                                    onChange={handleChangeFile}
                                    placeholder="add a file"
                                    type="file"
                                    value={importValue}
                                />
                            </div>
                        </div>
                        <div className="modal-action flex flex-row justify-around">
                            <Button
                                className={`btn-success btn-sm basis-1/3 ${loading ? ' loading' : ''}`}
                                onClick={handleSendButton}>
                                {loading ? '' : 'import'}
                            </Button>

                            <label htmlFor="importData" className="btn btn-outline btn-error btn-sm right-0 basis-1/3">
                                close
                            </label>
                        </div>
                        {errorMessage.message === '' ? (
                            ''
                        ) : (
                            <div className="mt-8 w-full bg-red-700 py-1.5 text-center text-slate-100">
                                <Error message={errorMessage.message} errors={errorMessage.errors} />
                            </div>
                        )}
                    </div>
                </label>
            </label>
        </React.Fragment>
    );
};

export default MainLeftMenuImport;
