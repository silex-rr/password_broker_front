import React, {useContext, useEffect} from 'react';
import PasswordBrokerContext from '../../../../src_shared/passwordBroker/contexts/PasswordBrokerContext';
import {
    ENTRY_GROUP_LOADED,
    ENTRY_GROUP_LOADING,
    ENTRY_GROUP_NOT_SELECTED,
    ENTRY_GROUP_REQUIRED_LOADING,
} from '../../../../src_shared/passwordBroker/constants/EntryGroupStatus';
import EntryGroup from './EntryGroup/EntryGroup';
import {ROLE_ADMIN, ROLE_MEMBER, ROLE_MODERATOR} from '../../../../src_shared/passwordBroker/constants/EntryGroupRole';
import {
    ENTRY_GROUP_MENU_HISTORY,
    ENTRY_GROUP_MENU_MAIN,
    ENTRY_GROUP_MENU_SETTINGS,
    ENTRY_GROUP_MENU_USERS,
} from '../../../../src_shared/passwordBroker/constants/EntryGroupMenu';
import {
    ENTRY_GROUP_USERS_LOADED,
    ENTRY_GROUP_USERS_LOADING,
    ENTRY_GROUP_USERS_NOT_SELECTED,
    ENTRY_GROUP_USERS_REQUIRED_LOADING,
} from '../../../../src_shared/passwordBroker/constants/EntryGroupUsersStatus';
import EntryGroupUsers from './EntryGroup/EntryGroupUsers';
import EntryGroupHistory from './EntryGroup/EntryGroupHistory';
import {useParams} from 'react-router-dom';

const MainBody = () => {
    const passwordBrokerContext = useContext(PasswordBrokerContext);

    let body = '';
    let head = '';

    const {
        entryGroupData,
        entryGroupId,
        entryGroupStatus,
        setEntryGroupStatus,
        loadEntryGroup,
        setEntryGroupMenu,
        entryGroupMenu,
        entryGroupUsersStatus,
        setEntryGroupUsersStatus,
        loadEntryGroupUsers,
        selectEntryGroup,
    } = passwordBrokerContext;
    const {entryGroupId: entryGroupIdParam} = useParams();
    useEffect(() => {
        if (typeof entryGroupIdParam === 'string' && entryGroupIdParam !== '' && entryGroupIdParam !== entryGroupId) {
            selectEntryGroup(entryGroupIdParam);
            return;
        }

        if (entryGroupStatus === ENTRY_GROUP_REQUIRED_LOADING) {
            setEntryGroupStatus(ENTRY_GROUP_LOADING);
            loadEntryGroup(entryGroupId);
        }
        if (entryGroupUsersStatus === ENTRY_GROUP_USERS_REQUIRED_LOADING) {
            setEntryGroupUsersStatus(ENTRY_GROUP_USERS_LOADING);
            loadEntryGroupUsers(entryGroupId);
        }
    }, [
        entryGroupStatus,
        entryGroupId,
        loadEntryGroup,
        setEntryGroupStatus,
        entryGroupUsersStatus,
        setEntryGroupUsersStatus,
        loadEntryGroupUsers,
        entryGroupIdParam,
        selectEntryGroup,
    ]);

    const menuClickHandler = e => {
        if (e.target.id === ENTRY_GROUP_MENU_USERS && entryGroupUsersStatus === ENTRY_GROUP_USERS_NOT_SELECTED) {
            setEntryGroupUsersStatus(ENTRY_GROUP_USERS_REQUIRED_LOADING);
        }
        setEntryGroupMenu(e.target.id);
    };

    switch (entryGroupStatus) {
        default:
            break;
        case ENTRY_GROUP_LOADING:
        case ENTRY_GROUP_REQUIRED_LOADING:
            head = <div className="px-5 py-3 ">loading</div>;
            body = '';
            break;
        case ENTRY_GROUP_NOT_SELECTED:
            head = <div className="px-5 py-3 ">Select an Entry Group</div>;
            body = '';
            break;
        case ENTRY_GROUP_LOADED:
            let menu = [];
            let menu_selected = false;
            let selected = '';
            const unSelectedTab = 'text-slate-700 hover:bg-slate-300 hover:text-slate-900';
            const selectedTab = 'tab-active';
            switch (entryGroupData.role.role) {
                case ROLE_ADMIN:
                    selected = unSelectedTab;
                    if (entryGroupMenu === ENTRY_GROUP_MENU_SETTINGS) {
                        selected = selectedTab;
                        menu_selected = true;
                    }
                    menu.push(
                        <span
                            id={ENTRY_GROUP_MENU_SETTINGS}
                            key={ENTRY_GROUP_MENU_SETTINGS}
                            onClick={menuClickHandler}
                            className={'tab tab-lifted ' + selected}>
                            Settings
                        </span>,
                    );
                // eslint-disable-next-line no-fallthrough
                case ROLE_MODERATOR:
                // eslint-disable-next-line no-fallthrough
                default:
                case ROLE_MEMBER:
                    selected = unSelectedTab;
                    if (!menu_selected && entryGroupMenu === ENTRY_GROUP_MENU_USERS) {
                        selected = selectedTab;
                        menu_selected = true;
                    }
                    menu.push(
                        <span
                            id={ENTRY_GROUP_MENU_USERS}
                            key={ENTRY_GROUP_MENU_USERS}
                            onClick={menuClickHandler}
                            className={'tab tab-lifted ' + selected}>
                            Users
                        </span>,
                    );

                    selected = unSelectedTab;
                    if (entryGroupMenu === ENTRY_GROUP_MENU_HISTORY) {
                        selected = selectedTab;
                        menu_selected = true;
                    }
                    menu.push(
                        <span
                            id={ENTRY_GROUP_MENU_HISTORY}
                            key={ENTRY_GROUP_MENU_HISTORY}
                            onClick={menuClickHandler}
                            className={'tab tab-lifted ' + selected}>
                            History
                        </span>,
                    );

                    selected = unSelectedTab;
                    if (!menu_selected || entryGroupMenu === ENTRY_GROUP_MENU_MAIN) {
                        selected = selectedTab;
                        menu_selected = true;
                    }
                    menu.push(
                        <span
                            id={ENTRY_GROUP_MENU_MAIN}
                            key={ENTRY_GROUP_MENU_MAIN}
                            onClick={menuClickHandler}
                            className={'tab tab-lifted ' + selected}>
                            Entries
                        </span>,
                    );
            }
            menu.reverse();

            head = (
                <div className="flex h-full w-full justify-between">
                    <div className="px-5 py-3 ">{entryGroupData.entryGroup.name}</div>
                    <div className="tabs pr-5 text-slate-800">{menu}</div>
                </div>
            );
            switch (entryGroupMenu) {
                default:
                case ENTRY_GROUP_MENU_MAIN:
                    body = <EntryGroup {...entryGroupData} />;
                    break;
                case ENTRY_GROUP_MENU_HISTORY:
                    body = <EntryGroupHistory />;
                    break;
                case ENTRY_GROUP_MENU_USERS:
                    switch (entryGroupUsersStatus) {
                        case ENTRY_GROUP_USERS_LOADED:
                            body = <EntryGroupUsers />;
                            break;
                        case ENTRY_GROUP_USERS_NOT_SELECTED:
                        case ENTRY_GROUP_USERS_LOADING:
                        case ENTRY_GROUP_USERS_REQUIRED_LOADING:
                            body = 'loading...';
                            break;

                        default:
                            body = 'Error';
                    }
                    break;
                case ENTRY_GROUP_MENU_SETTINGS:
                    body = 'settings';
                    break;
            }

            break;
    }

    return (
        <div className="basis-3/4 bg-slate-600 p-0 text-slate-100">
            <div className="grid grid-rows-3">
                <div className="row-span-3 bg-slate-200 p-0 text-2xl text-slate-700">{head}</div>
                <div className="row-span-3 p-5">{body}</div>
            </div>
        </div>
    );
};

export default MainBody;
