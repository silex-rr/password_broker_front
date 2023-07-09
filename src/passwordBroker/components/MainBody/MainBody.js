import {useContext, useEffect} from "react";
import {PasswordBrokerContext} from "../../contexts/PasswordBrokerContext";
import {
    ENTRY_GROUP_LOADED,
    ENTRY_GROUP_LOADING,
    ENTRY_GROUP_NOT_SELECTED,
    ENTRY_GROUP_REQUIRED_LOADING
} from "../../constants/EntryGroupStatus";
import EntryGroup from "./EntryGroup/EntryGroup";
import {ROLE_ADMIN, ROLE_MEMBER, ROLE_MODERATOR} from "../../constants/EntryGroupRole";
import {
    ENTRY_GROUP_MENU_HISTORY,
    ENTRY_GROUP_MENU_MAIN,
    ENTRY_GROUP_MENU_SETTINGS,
    ENTRY_GROUP_MENU_USERS
} from "../../constants/EntryGroupMenu";
import {
    ENTRY_GROUP_USERS_LOADED,
    ENTRY_GROUP_USERS_LOADING,
    ENTRY_GROUP_USERS_NOT_SELECTED,
    ENTRY_GROUP_USERS_REQUIRED_LOADING
} from "../../constants/EntryGroupUsersStatus";
import EntryGroupUsers from "./EntryGroup/EntryGroupUsers";
import EntryGroupHistory from "./EntryGroup/EntryGroupHistory";
import {EntryGroupProvider} from "../../contexts/EntryGroupContext";

const MainBody = () => {

    const passwordBrokerContext = useContext(PasswordBrokerContext)

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
        loadEntryGroupUsers
    } = passwordBrokerContext

    useEffect(() => {
        if (entryGroupStatus === ENTRY_GROUP_REQUIRED_LOADING) {
            setEntryGroupStatus(ENTRY_GROUP_LOADING)
            loadEntryGroup(entryGroupId)
        }
        if (entryGroupUsersStatus === ENTRY_GROUP_USERS_REQUIRED_LOADING) {
            setEntryGroupUsersStatus(ENTRY_GROUP_USERS_LOADING)
            loadEntryGroupUsers(entryGroupId)
        }
    }, [entryGroupStatus, entryGroupId, loadEntryGroup, setEntryGroupStatus,
        entryGroupUsersStatus, setEntryGroupUsersStatus, loadEntryGroupUsers])

    const menuClickHandler = (e) => {
        if (e.target.id === ENTRY_GROUP_MENU_USERS
            && entryGroupUsersStatus === ENTRY_GROUP_USERS_NOT_SELECTED
        ) {
            setEntryGroupUsersStatus(ENTRY_GROUP_USERS_REQUIRED_LOADING)
        }
        setEntryGroupMenu(e.target.id)
    }

    switch (entryGroupStatus) {
        default:
            break
        case ENTRY_GROUP_LOADING:
        case ENTRY_GROUP_REQUIRED_LOADING:
            head = (<div className="px-5 py-3 ">loading</div>)
            body = ''
            break
        case ENTRY_GROUP_NOT_SELECTED:
            head = (<div className="px-5 py-3 ">Select an Entry Group</div>)
            body = ''
            break
        case ENTRY_GROUP_LOADED:
            let menu = []
            let menu_selected = false;
            let selected = '';
            const unSelectedTab = 'text-slate-700 hover:bg-slate-300 hover:text-slate-900'
            const selectedTab = 'tab-active'
            switch (entryGroupData.role.role) {
                case ROLE_ADMIN:
                    selected = unSelectedTab
                    if (entryGroupMenu === ENTRY_GROUP_MENU_SETTINGS) {
                        selected = selectedTab
                        menu_selected = true
                    }
                    menu.push(
                        <span id={ENTRY_GROUP_MENU_SETTINGS} key={ENTRY_GROUP_MENU_SETTINGS}
                              onClick={menuClickHandler} className={"tab tab-lifted " + selected}>Settings</span>
                    )
                // eslint-disable-next-line no-fallthrough
                case ROLE_MODERATOR:
                // eslint-disable-next-line no-fallthrough
                default:
                case ROLE_MEMBER:
                    selected = unSelectedTab
                    if (!menu_selected && entryGroupMenu === ENTRY_GROUP_MENU_USERS) {
                        selected = selectedTab
                        menu_selected = true
                    }
                    menu.push(
                        <span id={ENTRY_GROUP_MENU_USERS} key={ENTRY_GROUP_MENU_USERS}
                              onClick={menuClickHandler} className={"tab tab-lifted " + selected}>Users</span>
                    )

                    selected = unSelectedTab
                    if (entryGroupMenu === ENTRY_GROUP_MENU_HISTORY) {
                        selected = selectedTab
                        menu_selected = true
                    }
                    menu.push(
                        <span id={ENTRY_GROUP_MENU_HISTORY} key={ENTRY_GROUP_MENU_HISTORY}
                              onClick={menuClickHandler} className={"tab tab-lifted " + selected}>History</span>
                    )

                    selected = unSelectedTab
                    if (!menu_selected || entryGroupMenu === ENTRY_GROUP_MENU_MAIN) {
                        selected = selectedTab
                        menu_selected = true
                    }
                    menu.push(
                        <span id={ENTRY_GROUP_MENU_MAIN} key={ENTRY_GROUP_MENU_MAIN}
                              onClick={menuClickHandler} className={"tab tab-lifted " + selected}>Entries</span>
                    )
            }
            menu.reverse()

            head = (
                <div className="w-full h-full flex justify-between">
                    <div className="px-5 py-3 ">
                        {entryGroupData.entryGroup.name}
                    </div>
                    <div className="tabs text-slate-800 pr-5">
                        {menu}
                    </div>
                </div>
            )
            switch (entryGroupMenu) {
                default:
                case ENTRY_GROUP_MENU_MAIN:
                    body = <EntryGroup {...entryGroupData}/>
                    break
                case ENTRY_GROUP_MENU_HISTORY:
                    body = <EntryGroupHistory />
                    break
                case ENTRY_GROUP_MENU_USERS:
                    switch(entryGroupUsersStatus) {
                        case ENTRY_GROUP_USERS_LOADED:
                            body = <EntryGroupUsers/>
                            break
                        case ENTRY_GROUP_USERS_NOT_SELECTED:
                        case ENTRY_GROUP_USERS_LOADING:
                        case ENTRY_GROUP_USERS_REQUIRED_LOADING:
                            body = 'loading...'
                            break

                        default:
                            body = 'Error'
                    }
                    break
                case ENTRY_GROUP_MENU_SETTINGS:
                    body = 'settings'
                    break

            }

            break
    }

    return (
        <div className="basis-3/4 p-0 text-slate-100 bg-slate-600">
            <div className="grid grid-rows-3">
                <div className="p-0 row-span-3 text-2xl bg-slate-200 text-slate-700">{head}</div>
                <div className="p-5 row-span-3">
                    <EntryGroupProvider>
                        {body}
                    </EntryGroupProvider>
                </div>
            </div>

        </div>
    )
}

export default MainBody
