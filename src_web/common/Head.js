import React, {useContext} from 'react';
import IdentityContext from '../../src_shared/identity/contexts/IdentityContext';
import PasswordBrokerContext from '../../src_shared/passwordBroker/contexts/PasswordBrokerContext';
import {
    MASTER_PASSWORD_FILLED_IN,
    MASTER_PASSWORD_INVALID,
    MASTER_PASSWORD_IS_EMPTY,
    MASTER_PASSWORD_VALIDATED,
} from '../../src_shared/passwordBroker/constants/MasterPasswordStates';
import {MdOutlineKey, MdOutlineKeyOff} from 'react-icons/md';
import {Link} from 'react-router-dom';

const Head = () => {
    const identityContext = useContext(IdentityContext);
    const {userName} = identityContext;
    const passwordBrokerContext = useContext(PasswordBrokerContext);
    const {masterPasswordState, showMasterPasswordModal} = passwordBrokerContext;
    //MdOutlineKeyOff
    let masterPasswordIcon = <span />;
    let masterPasswordIconClickHandler = () => {};
    switch (masterPasswordState) {
        default:
        case MASTER_PASSWORD_IS_EMPTY:
            masterPasswordIcon = (
                <span className="tooltip tooltip-bottom" data-tip="Master Pasword not entered">
                    <MdOutlineKeyOff className="mx-auto text-3xl" />
                </span>
            );
            masterPasswordIconClickHandler = () => {
                showMasterPasswordModal();
            };
            break;
        case MASTER_PASSWORD_FILLED_IN:
            masterPasswordIcon = (
                <span className="tooltip tooltip-bottom" data-tip="Master Pasword entered">
                    <MdOutlineKey className="mx-auto text-3xl text-yellow-300" />
                </span>
            );
            break;
        case MASTER_PASSWORD_INVALID:
            masterPasswordIcon = (
                <span className="tooltip tooltip-bottom" data-tip="Master Pasword is incorrect">
                    <MdOutlineKey className="mx-auto text-3xl text-error" />
                </span>
            );
            masterPasswordIconClickHandler = () => {
                showMasterPasswordModal();
            };
            break;
        case MASTER_PASSWORD_VALIDATED:
            masterPasswordIcon = (
                <span className="tooltip tooltip-bottom" data-tip="Master Pasword validated">
                    <MdOutlineKey className="mx-auto text-3xl text-green-200" />
                </span>
            );
            break;
    }

    return (
        <header className="px16 flex w-full flex-row justify-between bg-slate-700 text-slate-300">
            <div className="flex justify-start px-5 py-2">
                <Link to="/" className="btn btn-ghost text-3xl normal-case">
                    PasswordBroker
                </Link>
            </div>
            <nav className="flex justify-end px-5">
                <ul className="menu menu-horizontal flex self-center p-0 align-middle font-bold">
                    <li>
                        <Link to={'/admin'}>Admin Panel</Link>
                    </li>
                    <li className="" onClick={masterPasswordIconClickHandler}>
                        {masterPasswordIcon}
                    </li>
                    <li className="px-2">
                        <span>{userName}</span>
                    </li>
                    <li className="px-2">
                        <Link to={'/identity/logout'}>logout</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Head;
